import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import "../styles/searchbar.css";
import { User, Project } from "../globals";
import SearchResultRow from './SearchResultRow';
import { useNavigate } from "react-router-dom";

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
    const { user } = useAuth();
    const navigate = useNavigate();
    const searchDisplay = useBreakpointValue({ base: 'icon', md: 'input' });
    const [searchInput, setSearchInput] = useState<string>("``");
    const [allProjects, setAllProjects] = useState<Array<Project>>([]);


    const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure()

    async function fetchAllProjects() {
        const fetchProjects = await fetch(`${process.env.API_URL}/projects/users/${user?.id}`);
        const projects = await fetchProjects.json();
        setAllProjects(projects);
    }

    const handleSearchBarOnClick = () => {
        setSearchInput("");
        fetchAllProjects();
        onSearchOpen();
    }

    const handleSearchResultClick = (project: Project) => {
        onSearchClose();
        navigate(`/${user?.user_name}/projects/${project.id}`);
    };

    const filteredProjects = allProjects.filter(project => {
        if (searchInput === "") {
            return project.id === -1;
        } else {
            return project.title.toLowerCase().includes(searchInput.toLowerCase());
        }
    })

    return (
        <>
            <Flex justifyContent="flex-end" alignItems="center" width="full" pr={{ base: 2, md: 4 }}
                onClick={handleSearchBarOnClick}
            >
                {searchDisplay === 'input' ? (
                    <InputGroup w="250px" onClick={handleSearchBarOnClick} size="sm">
                        <InputLeftElement
                            pointerEvents="none"
                            children={<SearchIcon color="gray.700" />}
                        ></InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Search for your projects..."
                            variant="filled"
                            bg="white"
                            _placeholder={{ color: 'gray.500' }}
                            _hover={{ bg: 'gray.100', }}
                            _focus={{ bg: 'white' }}
                        />
                    </InputGroup>
                ) : (
                    <SearchIcon color="gray.300" mr="20px" cursor="pointer" onClick={handleSearchBarOnClick} />
                )}
            </Flex>

            <Modal isOpen={isSearchOpen} onClose={onSearchClose} >
                <ModalOverlay />
                <ModalContent className="searchModal">
                    <ModalHeader>
                        <InputGroup w="full" size="md" border="#13131A solid" borderRadius={8}>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<SearchIcon color="gray.700" />}
                            ></InputLeftElement>
                            <Input
                                type="text"
                                placeholder="Search for your projects..."
                                variant="filled"
                                bg="white"
                                _placeholder={{ color: 'gray.500' }}
                                _hover={{ bg: 'gray.100', }}
                                _focus={{ bg: 'white', borderWidth: '0.5px' }}
                                value={searchInput}
                                onChange={
                                    (e) => { setSearchInput(e.target.value); }
                                }
                            />
                        </InputGroup>
                    </ModalHeader>
                    <ModalBody className='search-results' maxHeight="70vh" overflowY="auto">
                        {filteredProjects.map((project) => (
                            <div className="one-search-result" onClick={() => { handleSearchResultClick(project) }}>
                                {project.title}
                            </div>
                        ))}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default SearchBar;