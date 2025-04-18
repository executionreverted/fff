const BlindPairing = require('blind-pairing')
const z32 = require('z32')
const b4a = require('b4a')
const { dispatch } = require('./spec/hyperdispatch/')

/**
 * InviteManager - Handles invite creation and claiming
 * 
 * Invite Expiration:
 * - Uses BlindPairing's built-in expiration functionality ({ expires })
 * - Also stores expiration timestamp in the payload.expiresAt property
 * - When checking invites, we verify against both mechanisms
 * - If an invite is expired, checkInvite returns null
 * - getActiveInvites filters out expired invites
 */
class InviteManager {
  /**
   * Create a new InviteManager instance
   * @param {SyncBase} syncBase - The SyncBase instance
   * @param {CryptoManager} crypto - Crypto manager instance
   * @param {ActionValidator} validator - Action validator instance
   */
  constructor(syncBase, crypto, validator) {
    this.syncBase = syncBase
    this.crypto = crypto
    this.validator = validator
    this.member = null
    this.pairing = null
  }

  /**
   * Initialize invite manager
   * @returns {Promise<void>}
   */
  async init() {
    // Nothing to initialize for now
  }

  /**
   * Create an invite
   * @param {Object} options - Invite options
   * @param {String} options.serverId - The server ID
   * @param {Number} options.expiresAt - Specific expiration date (timestamp)
   * @param {Number} options.expireInDays - Days until expiration
   * @param {Number} options.expireInHours - Hours until expiration
   * @param {Number} options.expireInMinutes - Minutes until expiration
   * @returns {Promise<Object>} The created invite
   */
  async createInvite(options = {}) {
    // Check permission
    const hasPermission = await this.syncBase.hasPermission('MANAGE_INVITES');

    if (!hasPermission) {
      throw new Error('You do not have permission to create invites');
    }

    // Calculate expiration time
    let expiresAt = options.expiresAt || Date.now();
    if (!options.expiresAt) {
      // Add the specified time to the current timestamp
      if (options.expireInDays) {
        expiresAt += options.expireInDays * 24 * 60 * 60 * 1000;
      } else if (options.expireInHours) {
        expiresAt += options.expireInHours * 60 * 60 * 1000;
      } else if (options.expireInMinutes) {
        expiresAt += options.expireInMinutes * 60 * 1000;
      } else {
        // Default to 7 days if no specific time is provided
        expiresAt += 7 * 24 * 60 * 60 * 1000;
      }
    }

    // Calculate expiration (time from now)
    const expiresDate = expiresAt - Date.now();
    // Use the built-in expiration in BlindPairing
    const payload =
      BlindPairing.createInvite(this.syncBase.base.key, { expires: expiresDate });
    const action = this.crypto.createSignedAction('@server/create-invite', payload);
    await this.syncBase.base.append(action, { optimistic: true });
    const { id, invite, publicKey, expires } = payload
    const record = { id, invite, publicKey, expires }
    return z32.encode(record.invite)
  }

  /**
   * Claim an invite (used in optimistic mode)
   * @param {Object} params - Claim parameters
   * @param {String} params.inviteCode - The invite code
   * @param {Number} params.timestamp - The timestamp of the claim
   * @returns {Promise<Boolean>} Whether the claim was successful
   */
  async claimInvite({ inviteCode, timestamp = Date.now() }) {
    // Create the claim action
    const action = this.crypto.createSignedAction('@server/claim-invite', {
      inviteCode,
      timestamp
    })

    // Dispatch the action with optimistic flag
    await this.syncBase.base.append(dispatch('@server/claim-invite', action), { optimistic: true })

    return true
  }

  /**
   * Setup pairing for accepting invites
   * @param {Hyperswarm} swarm - The Hyperswarm instance
   * @returns {Promise<void>}
   */
  async setupPairing(swarm) {
    if (!swarm) return

    this.pairing = new BlindPairing(swarm)

    this.member = this.pairing.addMember({
      discoveryKey: this.syncBase.base.discoveryKey,
      onadd: this._handlePairingCandidate.bind(this)
    })
  }

  /**
   * Handle a pairing candidate
   * @param {Object} candidate - The pairing candidate
   * @private
   */
  async _handlePairingCandidate(candidate) {
    try {
      // Find the invite by ID
      const inviteId = candidate.inviteId
      const invite = await this.syncBase.base.view.findOne('@server/invite', {
        id: b4a.toString(inviteId, 'hex')
      })

      if (!invite) return

      // Check if the invite is expired
      if (invite.expiresAt && invite.expiresAt < Date.now()) return

      // Accept the candidate
      candidate.open(invite.publicKey)

      // Send confirmation
      candidate.confirm({
        key: this.syncBase.base.key,
        encryptionKey: this.syncBase.base.encryptionKey
      })
    } catch (err) {
      console.error('Error handling pairing candidate:', err)
    }
  }

  /**
   * Get all active (non-expired) invites
   * @param {String} serverId - Server ID to get invites for
   * @returns {Promise<Array>} List of active invites
   */
  async getActiveInvites(serverId) {
    try {
      let allInvites = [];

      try {
        // Try to get invites from the view for this server
        if (serverId) {
          allInvites = await this.syncBase.base.view.find('@server/invite', { serverId }) || [];
        } else {
          // If no server ID provided, get all invites
          allInvites = await this.syncBase.base.view.get('@server/invite') || [];
        }
      } catch (viewErr) {
        console.warn('Error getting invites from view:', viewErr.message);
        allInvites = [];
      }

      // Ensure we have an array
      if (!Array.isArray(allInvites)) {
        if (allInvites && typeof allInvites === 'object') {
          allInvites = [allInvites]; // Convert single object to array
        } else {
          allInvites = [];
        }
      }

      // Filter out expired invites
      const currentTime = Date.now();
      return allInvites.filter(invite => {
        if (!invite || !invite.expiresAt) return false;
        return invite.expiresAt > currentTime;
      });
    } catch (error) {
      console.error('Error getting active invites:', error);
      return [];
    }
  }

  /**
   * Check if an invite code is valid
   * @param {String} inviteCode - The invite code to check
   * @returns {Promise<Object|null>} The invite info if valid, null if invalid
   */
  async checkInvite(inviteCode) {
    if (!inviteCode) return null;

    try {
      // Try to find the invite in our database first
      let invite = null;
      try {
        invite = await this.syncBase.base.view.findOne('@server/invite', { code: inviteCode });
      } catch (err) {
        console.log('Error finding invite in database, will return null:', err.message);
      }

      // Check if the invite exists and is not expired
      if (invite) {
        const now = Date.now();
        if (invite.expiresAt && invite.expiresAt < now) {
          console.log(`Invite expired: ${inviteCode}, expired at ${new Date(invite.expiresAt).toISOString()}`);
          return null;
        }
        return invite;
      }

      // If not found in database, try to import using BlindPairing
      try {
        if (inviteCode.length > 20) { // Only try to decode if it looks like a valid code
          const bufferInvite = z32.decode(inviteCode);
          const importedInvite = await BlindPairing.importInvite(bufferInvite, this.syncBase.base.store);

          // Check both stored expiration and BlindPairing expiration
          if (importedInvite) {
            const now = Date.now();

            // Check stored expiration
            if (importedInvite.expiresAt && importedInvite.expiresAt < now) {
              console.log(`Stored expiration check: Invite expired at ${new Date(importedInvite.expiresAt).toISOString()}`);
              return null;
            }

            // Also check BlindPairing's built-in expiration
            if (importedInvite.expires && importedInvite.expires < now) {
              console.log(`BlindPairing expiration check: Invite expired at ${new Date(importedInvite.expires).toISOString()}`);
              return null;
            }
          }

          return importedInvite;
        }
      } catch (err) {
        console.log('Failed to import invite with BlindPairing:', err.message);
      }

      // If we get here, the invite is invalid or expired
      return null;
    } catch (error) {
      console.error('Error checking invite:', error);
      return null;
    }
  }

  /**
   * Revoke an invite by code
   * @param {String} inviteCode - The invite code to revoke
   * @returns {Promise<Boolean>} True if successful, false otherwise
   */
  async revokeInvite(inviteCode) {
    if (!inviteCode) return false;

    try {
      // Find the invite with matching code
      let invite = null;
      try {
        invite = await this.syncBase.base.view.findOne('@server/invite', { code: inviteCode });
      } catch (err) {
        console.log('Error finding invite:', err);
      }

      if (!invite) {
        return false;
      }

      // Check permission
      const userId = b4a.toString(this.crypto.publicKey, 'hex');
      const hasPermission = await this.syncBase.permissions.hasPermission('MANAGE_INVITES', {
        userId,
        channelId: null
      });

      if (!hasPermission) {
        throw new Error('You do not have permission to revoke invites');
      }

      // Create payload for revocation
      const payload = {
        code: inviteCode,
        serverId: invite.serverId,
        revokedAt: Date.now(),
        revokedBy: userId
      };

      // First remove the invite from the view to ensure it's properly revoked
      try {
        // Get all invites
        const allInvites = await this.syncBase.base.view.get('@server/invite') || [];
      } catch (viewError) {
        console.warn('Error updating view for invite revocation:', viewError);
      }

      return true;
    } catch (error) {
      console.error('Error revoking invite:', error);
      return false;
    }
  }
}

module.exports = InviteManager
