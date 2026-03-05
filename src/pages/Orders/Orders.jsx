import React, { useEffect, useState } from 'react'
import './Orders.css'
import {toast} from "react-toastify"
import axios from "axios"
import { assets } from '../../assets/assets'

const Orders = ({url}) => {

  const [orders,setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url+"/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data || [])
      } else {
        toast.error(response.data.message || "Error fetching orders")
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error fetching orders")
    }
  }

  const statusHandler = async (event,orderId) =>{
    try {
      const response = await axios.post(url+"/api/order/status",{
        orderId,
        status: event.target.value
      })
      if (response.data.success) {
        toast.success("Status updated");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Error updating status");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating status");
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[])

  return (
    <div className='order-add'>
      <h3>Order Page</h3>
        <div className="order-list">
          {orders.map((order,index)=>{
            return (
            <div key={order._id || index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className='order-item-food'>
                  {order.items && order.items.map((item, idx)=>{
                    if (idx === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    }
                    return item.name + " x " + item.quantity + ", ";
                  })}
                </p>
                <p className='order-item-name'>{order.address?.firstName + " " + order.address?.lastName}</p>
                <div className="order-item-address">
                  <p>{order.address?.street + ","}</p>
                  <p>{order.address?.city + ", " + order.address?.state + ", " + order.address?.country + ", " + order.address?.zipcode}</p>
                </div>
                <p className='order-item-phone'>{order.address?.phone}</p>
              </div>
              <p>Items : {order.items?.length ?? 0}</p>
              <p>${order.amount}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status || ""}>
                <option value="Food Processing">Food Processing</option>
                <option value="Food Proccesing">Food Proccesing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            );
          })}
        </div>
    </div>
  )
}

export default Orders