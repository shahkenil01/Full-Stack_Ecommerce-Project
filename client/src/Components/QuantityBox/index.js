import Button from '@mui/material/Button';
import { FaMinus, FaPlus } from "react-icons/fa6";

const QuantityBox = ({ quantity, setQuantity }) => {
  const minus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const plus = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className='quantityDrop d-flex align-items-center'>
      <Button onClick={minus}><FaMinus /></Button>
      <input type="text" value={quantity} readOnly />
      <Button onClick={plus}><FaPlus /></Button>
    </div>
  );
};

export default QuantityBox;