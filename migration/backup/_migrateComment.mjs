import dotenv from 'dotenv'
import pkg from 'pg'
const { Client } = pkg

dotenv.config()

const walineDbUrl = process.env.WALINE_DATABASE_URL
const patchDbUrl = process.env.KUN_DATABASE_URL

// Connect to the waline database
const walineClient = new Client({
  connectionString: walineDbUrl
})

// Connect to the patch database
const patchClient = new Client({
  connectionString: patchDbUrl
})

const migrateComments = async () => {
  try {
    await walineClient.connect()
    await patchClient.connect()

    console.log('Clearing patch_comment table...')
    // Clear the patch_comment table and reset its sequence
    await patchClient.query(
      'TRUNCATE TABLE patch_comment RESTART IDENTITY CASCADE;'
    )

    console.log('Fetching comments from waline...')
    const { rows: comments } = await walineClient.query(
      "SELECT * FROM wl_comment WHERE status = 'approved';"
    )

    console.log('Fetching patch unique_id mappings...')
    const { rows: patches } = await patchClient.query(
      'SELECT id, unique_id FROM patch;'
    )
    const patchMap = patches.reduce((map, patch) => {
      map[patch.unique_id] = patch.id
      return map
    }, {})

    console.log('Inserting comments into patch_comment...')
    for (const comment of comments) {
      const uniqueId = comment.url.replace(/\//g, '')
      const patchId = patchMap[uniqueId]

      if (!patchId) {
        console.warn(`No patch_id found for url: ${comment.url}, skipping.`)
        continue
      }

      const parentId = null
      const userId = null

      await patchClient.query(
        `
        INSERT INTO patch_comment (content, parent_id, user_id, patch_id, created, updated)
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          comment.comment,
          parentId,
          userId,
          patchId,
          comment.insertedAt,
          comment.updatedAt
        ]
      )
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Error during migration:', error)
  } finally {
    await walineClient.end()
    await patchClient.end()
  }
}

migrateComments()
