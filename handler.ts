import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import Knex from 'knex'

const db = Knex({
  client: 'pg',
  connection: {
    host: 'redacted',
    database: 'luckydog',
    user: 'postgres',
    password: 'myluckydog',
    port: 5432,
  },
})

function toResponse(status: number, body: any): { statusCode: number, body: string } {
  return {
    statusCode: status,
    body: JSON.stringify(body),
  }
}

export async function hello(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {

  try {
    if(await db.schema.hasTable('dogs')) {
      return toResponse(400, {
        message: 'Table Exists'
      })
    }

    const table = await db.schema.createTable('dogs', t => {
      t.increments('id').primary()
      t.string('name').notNullable()
    })

    return toResponse(200, { message: 'Table Dogs Created' })
  } catch (err) {
    return toResponse(500, { error: err })
  }
}
