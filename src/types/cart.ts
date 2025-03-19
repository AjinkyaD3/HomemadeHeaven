export interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface DeliveryAddress {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
}
