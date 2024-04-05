import { PrismaClient } from "@prisma/client";
import {hashPassword} from "../../src/utils/bcrypt.js"
const prisma = new PrismaClient()

async function main() {
  const test1 = await prisma.user.upsert({
    where: { id: 1},
    update: {},
    create: {
    	email: 'test1@prisma.io',
    	name: 'Name1',
      sport: "Football", 
    	phone: "+977-0808069899",
    	country: "Nepal", 
    	roles: "ADMIN", 
      password: "test123#"
    },
  })

	const test2 = await prisma.user.upsert({
    where: { id: 2},
    update: {},
    create: {
    	email: 'test2@prisma.io',
    	name: 'Name2',
      sport: "Football", 
    	phone: "+977-0808069899",
    	country: "Nepal", 
    	roles: "USER", 
      password: "test123#"
    },
  })

  const sport1 = await prisma.category.upsert({
    where: {id:1},
    update: {},
    create: {
      sport: "Football",
      description: "Although football can trace its roots back to Ancient China, the modern version of the game was born on the streets of medieval England, before going on to become the most popular sport in the world.The (very) early games of football in medieval England involved a large mass of people who would attempt to drag a pig’s bladder—by any means possible—to markers at opposing ends of a town. Such events were well known for being as violent as they were popular. In the 16th century, English schools established the modern football codes, thereby transforming what were mob riots into a proper sport."
    }
  })

  const event1 = await prisma.events.upsert({
    where: {id: 1},
    update: {},
    create: {
      category: {connect: {id: 1}},
      eventTitle: "BRAZIL vs ARGENTINA",
      description: "First Football match of the tournament National team of Brazil vs National Team of Argentina",
      thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Football_in_Bloomington%2C_Indiana%2C_1995.jpg/800px-Football_in_Bloomington%2C_Indiana%2C_1995.jpg",
      published: true,
      liveChatEnabled: true,
      streamLink: "https://www.youtube.com/watch?v=bO3um2qqDuk",
    }
  })
  
  const liveChat1 = await prisma.livechat.upsert({
    where: {id: 1},
    update: {},
    create: {
      events: {connect: {id:1}},
    }
  })
  
  const chatMessage1 = await prisma.message.upsert({
    where: {id: 1},
    update: {},
    create: {
      user: {connect: {id: 2}},
      livechat: {connect: {id: 1}},
      messageType: "LIVECHAT",
    }
  })

  const comment1 = await prisma.comments.upsert({
    where: {id: 1},
    update: {},
    create: {
      events: {connect: {id:1}},
    }
  })

  const commentMessage1 = await prisma.message.upsert({
    where: {id: 1},
    update: {},
    create: {
      user: {connect: {id: 2}},
      comments: {connect: {id: 1}},
      messageType: "COMMENT",
    }
  })


  
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })