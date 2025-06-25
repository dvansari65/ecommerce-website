// components/common/LogoutModal.tsx
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    useDisclosure,
  } from "@chakra-ui/react";
  import toast from "react-hot-toast";
  import { useLogoutMutation } from "@/redux/api/userApi";
  import { useDispatch } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { userNotExist } from "@/redux/reducer/userReducer";
  
  interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
    const [logout, { isLoading }] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      try {
        const res = await logout().unwrap();
        toast.success(res.message || "Logged out successfully!");
      } catch {
        toast.error("Logout failed");
      } finally {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch(userNotExist());
        navigate("/login");
        onClose(); // close modal
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px)" />
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to log out?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="ghost">
              Cancel
            </Button>
            <Button onClick={handleLogout} colorScheme="red" isLoading={isLoading}>
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default LogoutModal;
  