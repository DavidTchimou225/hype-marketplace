export type Order = { id:string; userId:string; items:{productId:string; qty:number;}[]; total:number; status:'pending'|'paid'|'shipped'|'delivered' }
