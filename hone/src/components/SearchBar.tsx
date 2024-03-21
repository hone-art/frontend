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
    Flex,
    IconButton,
    useBreakpointValue
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBar = () => {
    const { user, logout } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchTerm, setSearchTerm] = useState('');
    const searchDisplay = useBreakpointValue({ base: 'icon', md: 'input' });
    const handleOnClick = ()=> {
        console.log('click');
    }
    return (
        <>
            <Flex justifyContent="flex-end" alignItems="center" width="full" pr={{ base: 2, md: 4 }}>
                {searchDisplay === 'input' ? (
                    <InputGroup w="250px" onClick={handleOnClick}>
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
                            _hover={{ bg: 'gray.100', }}
                            _focus={{ bg: 'white', borderColor: 'gray.300', }}
                        />
                    </InputGroup>
                ) : (
                    <SearchIcon color="gray.300" mr="20px" onClick={handleOnClick}/>
                )}
            </Flex>

        </>
    )
}

export default SearchBar;