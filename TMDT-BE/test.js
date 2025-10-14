import AddressModel from "./models/AddressModel"
import OrderModel from "./models/OrderModel"

const test = ()=>{
    getOrderItem: async(req, res)=>{
        const user = req.user
        const address = await AddressModel.find({user: user._id})
        const order = await OrderModel.aggregate[(
            {$match: {}}
        )] 
    }
}

export default test