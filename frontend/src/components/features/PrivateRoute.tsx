import type { RootState } from "@/redux/reducer/store";
import type { JSX } from "react";
import { useSelector } from "react-redux";

const PrivateRoute = ({child}:{child:JSX.Element})=>{
    const {user,loading} = useSelector((state:RootState)=>state.userReducer)
    if(loading) return <div>loading...</div>
    
}