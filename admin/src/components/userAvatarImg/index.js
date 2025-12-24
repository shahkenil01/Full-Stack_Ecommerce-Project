import { Person } from "@mui/icons-material";

// stable color from name (Google-style)
const getColorFromName = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "#1a73e8", // google blue
    "#34a853", // google green
    "#fbbc05", // google yellow
    "#ea4335", // google red
    "#6f42c1",
    "#0d6efd",
  ];

  return colors[Math.abs(hash) % colors.length];
};

const UserAvatarImgComponent = ({ img, name }) => {
  const firstLetter = name?.charAt(0)?.toUpperCase();
  const bgColor = getColorFromName(name);

  return (
    <div className="userImg">
      {
        img ? (
          <img src={img} alt="user" />
        ) : firstLetter ? (
          <div
            className="letterAvatar"
            style={{ backgroundColor: bgColor }}
          >
            {firstLetter}
          </div>
        ) : (
          <Person />
        )
      }
    </div>
  );
};

export default UserAvatarImgComponent;
