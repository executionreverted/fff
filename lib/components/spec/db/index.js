// This file is autogenerated by the hyperdb compiler
/* eslint-disable camelcase */

const { IndexEncoder, c } = require('hyperdb/runtime')
const { version, getEncoding, setVersion } = require('./messages.js')

// '@server/server' collection key
const collection0_key = new IndexEncoder([
  IndexEncoder.STRING
], { prefix: 0 })

function collection0_indexify (record) {
  const a = record.id
  return a === undefined ? [] : [a]
}

// '@server/server' value encoding
const collection0_enc = getEncoding('@server/server/hyperdb#0')

// '@server/server' reconstruction function
function collection0_reconstruct (version, keyBuf, valueBuf) {
  const key = collection0_key.decode(keyBuf)
  setVersion(version)
  const record = c.decode(collection0_enc, valueBuf)
  record.id = key[0]
  return record
}
// '@server/server' key reconstruction function
function collection0_reconstruct_key (keyBuf) {
  const key = collection0_key.decode(keyBuf)
  return {
    id: key[0]
  }
}

// '@server/server'
const collection0 = {
  name: '@server/server',
  id: 0,
  encodeKey (record) {
    const key = [record.id]
    return collection0_key.encode(key)
  },
  encodeKeyRange ({ gt, lt, gte, lte } = {}) {
    return collection0_key.encodeRange({
      gt: gt ? collection0_indexify(gt) : null,
      lt: lt ? collection0_indexify(lt) : null,
      gte: gte ? collection0_indexify(gte) : null,
      lte: lte ? collection0_indexify(lte) : null
    })
  },
  encodeValue (version, record) {
    setVersion(version)
    return c.encode(collection0_enc, record)
  },
  trigger: null,
  reconstruct: collection0_reconstruct,
  reconstructKey: collection0_reconstruct_key,
  indexes: []
}

// '@server/channel' collection key
const collection1_key = new IndexEncoder([
  IndexEncoder.STRING
], { prefix: 1 })

function collection1_indexify (record) {
  const a = record.channelId
  return a === undefined ? [] : [a]
}

// '@server/channel' value encoding
const collection1_enc = getEncoding('@server/channel/hyperdb#1')

// '@server/channel' reconstruction function
function collection1_reconstruct (version, keyBuf, valueBuf) {
  const key = collection1_key.decode(keyBuf)
  setVersion(version)
  const record = c.decode(collection1_enc, valueBuf)
  record.channelId = key[0]
  return record
}
// '@server/channel' key reconstruction function
function collection1_reconstruct_key (keyBuf) {
  const key = collection1_key.decode(keyBuf)
  return {
    channelId: key[0]
  }
}

// '@server/channel'
const collection1 = {
  name: '@server/channel',
  id: 1,
  encodeKey (record) {
    const key = [record.channelId]
    return collection1_key.encode(key)
  },
  encodeKeyRange ({ gt, lt, gte, lte } = {}) {
    return collection1_key.encodeRange({
      gt: gt ? collection1_indexify(gt) : null,
      lt: lt ? collection1_indexify(lt) : null,
      gte: gte ? collection1_indexify(gte) : null,
      lte: lte ? collection1_indexify(lte) : null
    })
  },
  encodeValue (version, record) {
    setVersion(version)
    return c.encode(collection1_enc, record)
  },
  trigger: null,
  reconstruct: collection1_reconstruct,
  reconstructKey: collection1_reconstruct_key,
  indexes: []
}

// '@server/message' collection key
const collection2_key = new IndexEncoder([
  IndexEncoder.STRING,
  IndexEncoder.STRING
], { prefix: 2 })

function collection2_indexify (record) {
  const arr = []

  const a0 = record.id
  if (a0 === undefined) return arr
  arr.push(a0)

  const a1 = record.channelId
  if (a1 === undefined) return arr
  arr.push(a1)

  return arr
}

// '@server/message' value encoding
const collection2_enc = getEncoding('@server/message/hyperdb#2')

// '@server/message' reconstruction function
function collection2_reconstruct (version, keyBuf, valueBuf) {
  const key = collection2_key.decode(keyBuf)
  setVersion(version)
  const record = c.decode(collection2_enc, valueBuf)
  record.id = key[0]
  record.channelId = key[1]
  return record
}
// '@server/message' key reconstruction function
function collection2_reconstruct_key (keyBuf) {
  const key = collection2_key.decode(keyBuf)
  return {
    id: key[0],
    channelId: key[1]
  }
}

// '@server/message'
const collection2 = {
  name: '@server/message',
  id: 2,
  encodeKey (record) {
    const key = [record.id, record.channelId]
    return collection2_key.encode(key)
  },
  encodeKeyRange ({ gt, lt, gte, lte } = {}) {
    return collection2_key.encodeRange({
      gt: gt ? collection2_indexify(gt) : null,
      lt: lt ? collection2_indexify(lt) : null,
      gte: gte ? collection2_indexify(gte) : null,
      lte: lte ? collection2_indexify(lte) : null
    })
  },
  encodeValue (version, record) {
    setVersion(version)
    return c.encode(collection2_enc, record)
  },
  trigger: null,
  reconstruct: collection2_reconstruct,
  reconstructKey: collection2_reconstruct_key,
  indexes: []
}

// '@server/user' collection key
const collection3_key = new IndexEncoder([
  IndexEncoder.STRING,
  IndexEncoder.STRING
], { prefix: 3 })

function collection3_indexify (record) {
  const arr = []

  const a0 = record.id
  if (a0 === undefined) return arr
  arr.push(a0)

  const a1 = record.publicKey
  if (a1 === undefined) return arr
  arr.push(a1)

  return arr
}

// '@server/user' value encoding
const collection3_enc = getEncoding('@server/user/hyperdb#3')

// '@server/user' reconstruction function
function collection3_reconstruct (version, keyBuf, valueBuf) {
  const key = collection3_key.decode(keyBuf)
  setVersion(version)
  const record = c.decode(collection3_enc, valueBuf)
  record.id = key[0]
  record.publicKey = key[1]
  return record
}
// '@server/user' key reconstruction function
function collection3_reconstruct_key (keyBuf) {
  const key = collection3_key.decode(keyBuf)
  return {
    id: key[0],
    publicKey: key[1]
  }
}

// '@server/user'
const collection3 = {
  name: '@server/user',
  id: 3,
  encodeKey (record) {
    const key = [record.id, record.publicKey]
    return collection3_key.encode(key)
  },
  encodeKeyRange ({ gt, lt, gte, lte } = {}) {
    return collection3_key.encodeRange({
      gt: gt ? collection3_indexify(gt) : null,
      lt: lt ? collection3_indexify(lt) : null,
      gte: gte ? collection3_indexify(gte) : null,
      lte: lte ? collection3_indexify(lte) : null
    })
  },
  encodeValue (version, record) {
    setVersion(version)
    return c.encode(collection3_enc, record)
  },
  trigger: null,
  reconstruct: collection3_reconstruct,
  reconstructKey: collection3_reconstruct_key,
  indexes: []
}

// '@server/role' collection key
const collection4_key = new IndexEncoder([
  IndexEncoder.STRING
], { prefix: 4 })

function collection4_indexify (record) {
  const a = record.userId
  return a === undefined ? [] : [a]
}

// '@server/role' value encoding
const collection4_enc = getEncoding('@server/role/hyperdb#4')

// '@server/role' reconstruction function
function collection4_reconstruct (version, keyBuf, valueBuf) {
  const key = collection4_key.decode(keyBuf)
  setVersion(version)
  const record = c.decode(collection4_enc, valueBuf)
  record.userId = key[0]
  return record
}
// '@server/role' key reconstruction function
function collection4_reconstruct_key (keyBuf) {
  const key = collection4_key.decode(keyBuf)
  return {
    userId: key[0]
  }
}

// '@server/role'
const collection4 = {
  name: '@server/role',
  id: 4,
  encodeKey (record) {
    const key = [record.userId]
    return collection4_key.encode(key)
  },
  encodeKeyRange ({ gt, lt, gte, lte } = {}) {
    return collection4_key.encodeRange({
      gt: gt ? collection4_indexify(gt) : null,
      lt: lt ? collection4_indexify(lt) : null,
      gte: gte ? collection4_indexify(gte) : null,
      lte: lte ? collection4_indexify(lte) : null
    })
  },
  encodeValue (version, record) {
    setVersion(version)
    return c.encode(collection4_enc, record)
  },
  trigger: null,
  reconstruct: collection4_reconstruct,
  reconstructKey: collection4_reconstruct_key,
  indexes: []
}

// '@server/invite' collection key
const collection5_key = new IndexEncoder([
  IndexEncoder.BUFFER
], { prefix: 5 })

function collection5_indexify (record) {
  const a = record.id
  return a === undefined ? [] : [a]
}

// '@server/invite' value encoding
const collection5_enc = getEncoding('@server/invite/hyperdb#5')

// '@server/invite' reconstruction function
function collection5_reconstruct (version, keyBuf, valueBuf) {
  const key = collection5_key.decode(keyBuf)
  setVersion(version)
  const record = c.decode(collection5_enc, valueBuf)
  record.id = key[0]
  return record
}
// '@server/invite' key reconstruction function
function collection5_reconstruct_key (keyBuf) {
  const key = collection5_key.decode(keyBuf)
  return {
    id: key[0]
  }
}

// '@server/invite'
const collection5 = {
  name: '@server/invite',
  id: 5,
  encodeKey (record) {
    const key = [record.id]
    return collection5_key.encode(key)
  },
  encodeKeyRange ({ gt, lt, gte, lte } = {}) {
    return collection5_key.encodeRange({
      gt: gt ? collection5_indexify(gt) : null,
      lt: lt ? collection5_indexify(lt) : null,
      gte: gte ? collection5_indexify(gte) : null,
      lte: lte ? collection5_indexify(lte) : null
    })
  },
  encodeValue (version, record) {
    setVersion(version)
    return c.encode(collection5_enc, record)
  },
  trigger: null,
  reconstruct: collection5_reconstruct,
  reconstructKey: collection5_reconstruct_key,
  indexes: []
}

const collections = [
  collection0,
  collection1,
  collection2,
  collection3,
  collection4,
  collection5
]

const indexes = [
]

module.exports = { version, collections, indexes, resolveCollection, resolveIndex }

function resolveCollection (name) {
  switch (name) {
    case '@server/server': return collection0
    case '@server/channel': return collection1
    case '@server/message': return collection2
    case '@server/user': return collection3
    case '@server/role': return collection4
    case '@server/invite': return collection5
    default: return null
  }
}

function resolveIndex (name) {
  switch (name) {
    default: return null
  }
}
