
interface props {
    isOpen:boolean,
    onClose:()=>void
}

const ChangeProfileInfoCard = ({isOpen,onClose}:props)=>{
    if(!isOpen) return null

    return (
        <div className="fixed inset-0">
            
        </div>
    )
}

export default ChangeProfileInfoCard