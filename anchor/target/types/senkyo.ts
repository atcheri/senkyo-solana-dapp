/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/senkyo.json`.
 */
export type Senkyo = {
  "address": "CLDgc2Q7uUP7hqhvxkbCAWrFK88qNNmcXqusQUR3dhVp",
  "metadata": {
    "name": "senkyo",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createPoll",
      "discriminator": [
        182,
        171,
        112,
        238,
        6,
        219,
        14,
        110
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "poll",
          "writable": true
        },
        {
          "name": "counter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "start",
          "type": "u64"
        },
        {
          "name": "end",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "counter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "registrations",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "registerCandidate",
      "discriminator": [
        91,
        136,
        96,
        222,
        242,
        4,
        160,
        182
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "poll",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "pollId"
              }
            ]
          }
        },
        {
          "name": "candidate",
          "writable": true
        },
        {
          "name": "counter",
          "writable": true
        },
        {
          "name": "registrations",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        },
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "poll",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "pollId"
              }
            ]
          }
        },
        {
          "name": "candidate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "pollId"
              },
              {
                "kind": "arg",
                "path": "cid"
              }
            ]
          }
        },
        {
          "name": "voter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "pollId"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        },
        {
          "name": "cid",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "candidate",
      "discriminator": [
        86,
        69,
        250,
        96,
        193,
        10,
        222,
        123
      ]
    },
    {
      "name": "counter",
      "discriminator": [
        255,
        176,
        4,
        245,
        188,
        253,
        124,
        25
      ]
    },
    {
      "name": "poll",
      "discriminator": [
        110,
        234,
        167,
        188,
        231,
        136,
        153,
        111
      ]
    },
    {
      "name": "registration",
      "discriminator": [
        158,
        129,
        230,
        90,
        93,
        95,
        101,
        55
      ]
    },
    {
      "name": "voter",
      "discriminator": [
        241,
        93,
        35,
        191,
        254,
        147,
        17,
        202
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidDate",
      "msg": "Start date cannot be greater than End date"
    },
    {
      "code": 6001,
      "name": "candidateAlreadyRegistered",
      "msg": "Candidate is already registered"
    },
    {
      "code": 6002,
      "name": "voterAlreadyVoted",
      "msg": "Voter cannot vote twice"
    },
    {
      "code": 6003,
      "name": "candidateNotRegistered",
      "msg": "Candidate is not in the poll"
    },
    {
      "code": 6004,
      "name": "pollDoesNotExist",
      "msg": "Poll not found"
    },
    {
      "code": 6005,
      "name": "pollNotActive",
      "msg": "Poll not currently active"
    },
    {
      "code": 6006,
      "name": "pollCounterUnderflow",
      "msg": "Poll counter cannot be less than zero"
    }
  ],
  "types": [
    {
      "name": "candidate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cid",
            "type": "u64"
          },
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "votes",
            "type": "u64"
          },
          {
            "name": "hasRegistered",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "counter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "poll",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "start",
            "type": "u64"
          },
          {
            "name": "end",
            "type": "u64"
          },
          {
            "name": "candidates",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "registration",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "voter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cid",
            "type": "u64"
          },
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "hasVoted",
            "type": "bool"
          }
        ]
      }
    }
  ]
};