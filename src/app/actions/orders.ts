"use server"

import db from "@/db/db"

export const checkExistingOrder = async(email :string, productId: string) => {
   const order = await db.order.findFirst({
        where: {user :{email}, productId},
        select: {id : true}
    })
    return order != null
}