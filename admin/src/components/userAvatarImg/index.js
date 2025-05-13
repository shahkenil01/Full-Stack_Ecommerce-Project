
const UserAvatarImgComponent =(props)=>{
  return(
    <div className={`userImg ${props.lg===true && 'lg'}`}>
      <span className="rounded-circle">
        <img src={props.img} alt="profile"/>
      </span>
    </div>
  )
}

export default UserAvatarImgComponent;