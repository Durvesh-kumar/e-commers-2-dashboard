

type ProductType = {
   _id: string;
   title: string;
   discription: string;
   media: [string];
   brand: string;
   collections: CollectionType |any;
   tags: [string];
   price: number;
   pay: number;
   sizes: [string];
   colors: [string];
   category: string;
}

type DashboardUserType = {
   _id: string;
   email: string;
   name: string;
   image: string;
   role: string;
   isVerified: string;
   exp: number | undefined;
   collections: CollectionType
}

type CollectionType = {
   _id: string;
   title: string;
   userId: DashboardUserType;
   discription: string;
   image: string;
   products: ProductType[];
   addres: string;
   phoneNo: string;
   pinCode: string;
   city: string;
   state: string;
   countery: string;
   createdAt: string;
   updatedAt: string;
}

type CartItem = {
   item: ProductType;
   size?: string,
   quantity: number;
   color?: string
}

type ShippingAddressType = {
   state: string;
   city: string;
   postalCode: string;
   address: string;
   street: string;
}

type OrderType = {
   customerName: string;
   customerEmail: string;
   orderId: string,
   productId: string;
   products: number;
   orderLength: number;
   shippingAddress: ShippingAddressType;
   totalAmount: number;
   createdAt: string;
}

type CustomersType = {
   _id: string;
   email: string;
   name: string;
   orders: string[];
}

type ReviewsType = {
   _id: string;
   image: string;
   email: string;
   name: string;
   message: string;
   clerkId: string;
   productId: string;
   rating: string;
}

type OrderDetailsType={
   product:ProductType;
   color: string;
   size: string;
   quantity:number;
}
