import { Link } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

import "../styles/footer.css"

const Footer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <footer id="footer">
        <Link to="/about" className="footer-item">About us</Link>
        <p onClick={onOpen} className="footer-item">Terms and Conditions</p>
      </footer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terms and Conditons for Hone</ModalHeader>
          <ModalCloseButton className="modal-close-btn" />
          <ModalBody>
            <ol className="ordered-list">
              <li>
                <strong>Use of the Application:</strong>
                <ul className="unordered-list">
                  <li>The Application allows users to upload images of their artwork and create a digital journal to showcase their work.</li>
                </ul>
              </li>
              <br />
              <li>
                <strong>User Content:</strong>
                <ul className="unordered-list">
                  <li>By uploading images to the Application, you grant Hone a non-exclusive, royalty-free, worldwide, perpetual, and irrevocable license to use, modify, reproduce, distribute, and display the content for the purpose of operating and improving the Application.</li>
                </ul>
              </li>
              <br />
              <li>
                <strong>User Responsibilities:</strong>
                <ul className="unordered-list">
                  <li>Users are solely responsible for the content they upload to the Application.</li>
                  <li>Users must not upload any content that infringes upon the intellectual property rights, privacy, or any other rights of any third party.</li>
                  <li>Users must not upload any content that is unlawful, defamatory, obscene, or otherwise objectionable.</li>
                </ul>
              </li>
              <br />
              <li>
                <strong>Privacy Policy:</strong>
                <ul className="unordered-list">
                  <li>Hone respects the privacy of its users.</li>
                  <li>We use the information collected to operate, maintain, and improve the Application's functionality and user experience.</li>
                  <li>Non-personal information may be used for analytical purposes to understand how users interact with the Application and to identify trends and patterns.</li>
                  <li>We do not sell, trade, or otherwise transfer your personal information to third parties.</li>
                  <li>Your personal information may be disclosed in limited circumstances, such as when required by law or to protect our legal rights.</li>
                  <li>Despite our best efforts, no method of transmission over the internet or method of electronic storage is 100% secure. Therefore, we cannot guarantee absolute security of your information.</li>
                </ul>
              </li>
              <br />
              <li>
                <strong>Intellectual Property:</strong>
                <ul className="unordered-list">
                  <li>All intellectual property rights in the Application, including but not limited to copyrights, trademarks, and trade secrets, are owned by Hone.</li>
                  <li>Users may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products, or services obtained from the Application without the prior written consent of Hone.</li>
                </ul>
              </li>
              <br />
              <li>
                <strong>Termination:</strong>
                <ul className="unordered-list">
                  <li>Hone reserves the right to terminate or suspend access to the Application at any time, with or without cause, and without prior notice.</li>
                </ul>
              </li>
              <br />
              <li>
                <strong>Disclaimer of Warranties:</strong>
                <ul className="unordered-list">
                  <li >The Application is provided on an "as is" and "as available" basis, without warranties of any kind, either express or implied.</li>
                  <li>Hone does not warrant that the Application will be uninterrupted or error-free, that defects will be corrected, or that the Application is free of viruses or other harmful components.</li>
                </ul>
              </li>
              <br />
              <li>
                <strong>Limitation of Liability:</strong>
                <ul className="unordered-list">
                  <li>In no event shall Hone be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, arising out of or in connection with your use of the Application.</li>
                </ul>
              </li>
              <br />
              <li>
                <strong>Governing Law:</strong>
                <ul className="unordered-list">
                  <li>These Terms shall be governed by and construed in accordance with the laws of Japan, without regard to its conflict of law provisions.</li>
                </ul>
              </li>
              <br />
              <li>
                <strong>Changes to Terms:</strong>
                <ul className="unordered-list">
                  <li>Hone reserves the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.</li>
                </ul>
              </li>
            </ol>
          </ModalBody>

          <ModalFooter className="modal-footer">
            <p>
              By using the Application, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use the Application.
            </p>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Footer;