function schema() {
  return {
    description: 'Creates a new project',
    headers: {
      type: 'object',
      properties: {
        Authorization: {
          description: 'Example: Bearer 12345',
          type: 'string',
        }
      }
    },
    body: {
      type: 'object',
      properties: {
        publicId: {
          description: 'Public ID of the project',
          type: 'number'
        },
        ownerPublicId: {
          description: 'User id of the owner of the project',
          type: 'number'
        },
        reviewerPublicId: {
          description: 'User id of the reviewer of the project',
          type: 'integer'
        },
        stagesCost: {
          description: 'Sorted array of cost (ether) by stage',
          type: 'array',
          minItems: 1,
          items: { type: 'string' }
        }
      }
    },
    required: [
      'Authorization',
      'publicId',
      'ownerPublicId',
      'reviewerPublicId',
      'stagesCost'
    ],
    response: {
      202: {
        type: 'object',
        properties: {
          publicId: { type: 'number' },
          ownerPublicId: { type: 'number' },
          reviewerPublicId: { type: 'number' },
          stagesCost: {
            type: 'array',
            minItems: 1,
            items: { type: 'string' }
          },
          stagesStates: {
            description: 'The states of completeness of each stage',
            type: 'array',
            minItems: 1,
            items: { type: 'boolean' }
          },
          creationStatus: {
            description: "Project's creation status",
            type: 'string',
            enum: ['building', 'mining', 'done']
          },
          privateId: {
            description: "Project's id in smart contract",
            type: 'number',
            nullable: true
          },
          balance: { type: 'string', nullable: true },
          state: {
            description: 'The current state of the project',
            type: 'string',
            enum: ['INITIALIZING', 'FUNDING', 'IN_PROGRESS', 'COMPLETED']
          }
        }
      },
      404: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'Either owner or Reviewer wallet requested could not be found'
          }
        }
      }
    }
  };
}

module.exports = { schema };
