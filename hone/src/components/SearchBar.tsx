import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth";


import {
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    InputGroup,
    InputLeftElement,
    Icon,
    Flex
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBar = () => {
    const { user, logout } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <>
            <Flex justifyContent="flex-end" alignItems="center" width="full" border="solid white" pr={4}>
                <InputGroup w="250px" >
                    <InputLeftElement
                        pointerEvents="none"
                        children={<SearchIcon color="gray.700" />}
                    ></InputLeftElement>
                    <Input
                        type="text"
                        placeholder="Search for projects here..."
                        variant="filled"
                        bg="white"
                        _placeholder={{ color: 'gray.500' }}
                        _hover={{
                            bg: 'gray.100',
                        }}
                        _focus={{
                            bg: 'white',
                            borderColor: 'gray.300',
                        }}
                    />
                </InputGroup>
            </Flex>

        </>
    )
}

export default SearchBar;