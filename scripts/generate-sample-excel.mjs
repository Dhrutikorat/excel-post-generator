import * as XLSX from 'xlsx'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const rows = [
  { Story: 'Sonu & Meow', Character: 'Aman', 'Team 1': 'Krishna S', 'Team 2': 'Ravi' },
  { Story: 'Sonu & Meow', Character: 'Karan', 'Team 1': 'Ishika', 'Team 2': 'Priya' },
  { Story: 'Sonu & Meow', Character: 'Mayadidi', 'Team 1': 'Sweta', 'Team 2': 'Anita' },
  { Story: 'Sonu & Meow', Character: 'Sonu', 'Team 1': 'Pooja', 'Team 2': 'Kavya' },
  { Story: 'Sonu & Meow', Character: 'Meow', 'Team 1': 'Jimmy', 'Team 2': 'Rohan' },
  { Story: 'Sonu & Meow', Character: 'Mithumiya', 'Team 1': 'Neha', 'Team 2': 'Sneha' },
  { Story: 'Sonu & Meow', Character: 'Kudamji', 'Team 1': 'Manisha', 'Team 2': 'Divya' },
  { Story: 'Sonu & Meow', Character: 'Patangiyu', 'Team 1': 'Jimmy & Manisha', 'Team 2': 'Amit & Riya' },
  { Story: 'Sonu & Meow', Character: 'AV', 'Team 1': 'Manisha', 'Team 2': 'Neha' },
  { Story: 'Sonu & Meow', Character: 'All characters', 'Team 1': '', 'Team 2': '' },

  { Story: 'Lumpy & pooh', Character: 'Micky & honeybee', 'Team 1': 'Manisha', 'Team 2': 'Kiran' },
  { Story: 'Lumpy & pooh', Character: 'Smarty', 'Team 1': 'Krishna V', 'Team 2': 'Arjun' },
  { Story: 'Lumpy & pooh', Character: 'Lumpy', 'Team 1': 'Pooja', 'Team 2': 'Meera' },
  { Story: 'Lumpy & pooh', Character: 'Pooh', 'Team 1': 'Nimisha', 'Team 2': 'Tina' },
  { Story: 'Lumpy & pooh', Character: 'Tiger', 'Team 1': 'Muskan', 'Team 2': 'Zara' },
  { Story: 'Lumpy & pooh', Character: 'Jimy', 'Team 1': 'Sweta', 'Team 2': 'Nisha' },
  { Story: 'Lumpy & pooh', Character: 'AV', 'Team 1': 'Dhruvina', 'Team 2': 'Komal' },
  { Story: 'Lumpy & pooh', Character: 'All characters', 'Team 1': '', 'Team 2': '' },

  { Story: 'Jealousy ki Remedy', Character: 'Flory', 'Team 1': 'Miral', 'Team 2': 'Sana' },
  { Story: 'Jealousy ki Remedy', Character: 'Fiyona', 'Team 1': 'Neha', 'Team 2': 'Pooja' },
  { Story: 'Jealousy ki Remedy', Character: 'Spoty', 'Team 1': 'Hemangi', 'Team 2': 'Rekha' },
  { Story: 'Jealousy ki Remedy', Character: 'Polly', 'Team 1': 'Ishika', 'Team 2': 'Nidhi' },
  { Story: 'Jealousy ki Remedy', Character: 'Mr travor', 'Team 1': 'Krishna S', 'Team 2': 'Vikram' },
  { Story: 'Jealousy ki Remedy', Character: 'Teacher', 'Team 1': 'Heer', 'Team 2': 'Jaya' },
  { Story: 'Jealousy ki Remedy', Character: 'AV', 'Team 1': 'Aunty', 'Team 2': 'Masi' },
  { Story: 'Jealousy ki Remedy', Character: 'All characters', 'Team 1': '', 'Team 2': '' },

  { Story: 'Maskari na jokhamo', Character: 'Parth', 'Team 1': 'Drasti', 'Team 2': 'Isha' },
  { Story: 'Maskari na jokhamo', Character: 'Dhruv & mom', 'Team 1': 'Miral', 'Team 2': 'Sonal' },
  { Story: 'Maskari na jokhamo', Character: 'Mona & Ramakdavada kaka', 'Team 1': 'Hemangi', 'Team 2': 'Usha' },
  { Story: 'Maskari na jokhamo', Character: 'Pinky & Kid', 'Team 1': 'Heer', 'Team 2': 'Ritu' },
  { Story: 'Maskari na jokhamo', Character: 'Jay', 'Team 1': 'Krishna V', 'Team 2': 'Dev' },
  { Story: 'Maskari na jokhamo', Character: 'Teacher, Principal & Panipuri', 'Team 1': 'Nimisha', 'Team 2': 'Shreya' },
  { Story: 'Maskari na jokhamo', Character: 'Flex & Props', 'Team 1': 'Muskan', 'Team 2': 'Tanvi' },
  { Story: 'Maskari na jokhamo', Character: 'AV', 'Team 1': 'Dhruti', 'Team 2': 'Khushi' },
  { Story: 'Maskari na jokhamo', Character: 'All characters', 'Team 1': '', 'Team 2': '' },
]

const worksheet = XLSX.utils.json_to_sheet(rows)
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, 'teams')

const outputPath = join(__dirname, '..', 'public', 'sample-data.xlsx')
writeFileSync(outputPath, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }))
console.log(`Created ${outputPath}`)
