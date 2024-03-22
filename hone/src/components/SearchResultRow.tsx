import { Project, User } from "../globals";
import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Props = {
    project: Project;
    user: User | null;
    onSearchClose: () => void;
}

const SearchResultRow: FC<Props> = ({ project, user, onSearchClose }) => {
    const navigate = useNavigate();
    const [needToNavigate, setNeedToNavigate] = useState<boolean>(false);

    // useEffect(() => {
    //     navigate(`/${user?.user_name}/projects/${project.id}`);
    // }, [needToNavigate])

    const handleClick = () => {
        console.log(needToNavigate);
        onSearchClose();
        setNeedToNavigate(true);
        console.log(user);
        console.log(project);
        console.log(needToNavigate);
        navigate(`/${user?.user_name}/projects/${project.id}`);
    };

    return (
        <>
            <div className="one-search-result" onClick={handleClick}>
                <Link to={`/${user?.user_name}/projects/${project.id}`}>{project.title}</Link>
            </div>
        </>
    )
}

export default SearchResultRow;