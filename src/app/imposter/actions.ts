'use server'

import { db } from '@/db'
import { imposterCategoriesTable, impostorWordsTable } from '@/db/schema'
import { sql } from 'drizzle-orm'

export async function dbGetCategories() {
  try {
    const categories = await db.select().from(imposterCategoriesTable)
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

export async function dbGetRandomWord(categoryId: string) {
  try {
    const [randomWord] = await db
      .select()
      .from(impostorWordsTable)
      .where(sql`${impostorWordsTable.categoryId} = ${categoryId}`)
      .orderBy(sql`RANDOM()`)
      .limit(1)
    
    return randomWord
  } catch (error) {
    console.error('Error fetching random word:', error)
    throw new Error('Failed to fetch random word')
  }
}
