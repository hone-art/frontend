import { FC, useState, useEffect } from "react";
import "../styles/project.css"
import { useParams, Link } from "react-router-dom";
import { User, Image } from '../globals';
import { Project as ProjectInterface, Entry as EntryInterface } from "../globals";
import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";
import ProjectDescription from "../components/ProjectDescription";
import EditableProjectDescription from "../components/EditableProjectDescription";
import Entry from "../components/Entry";
// import { parse } from "dotenv";



type Props = {
  user: User | null;
  isLoggedIn: boolean;
}

const Project: FC<Props> = ({ user, isLoggedIn }) => {
  const { username, projectId } = useParams<string>();
  const [project, setProject] = useState<ProjectInterface>();
  const [isSameUser, setIsSameUser] = useState<boolean>(false);
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectImageURL, setProjectImageURL] = useState<string>("");
  const [isProjectEditable, setIsProjectEditable] = useState<boolean>(false);
  const [entries, setEntries] = useState<Array<EntryInterface>>();

  useEffect(() => {
    if (user?.user_name === username) setIsSameUser(true);

    async function fetchProjectAndEntries() {
      const parsedProjectId: number = parseInt(projectId!);
      const fetchProject = await fetch(`http://localhost:8080/projects/${parsedProjectId}`);
      const parsedProject: ProjectInterface = await fetchProject.json();
      setProject(parsedProject);

      setProjectTitle(parsedProject.title);
      setProjectDescription(parsedProject.description);

      const fetchProjectImg = await fetch(`http://localhost:8080/images/${parsedProject.img_id}`);
      const projectImg: Image = await fetchProjectImg.json();
      setProjectImageURL(projectImg.url);

      const fetchEntries = await fetch(`http://localhost:8080/entries/projects/${parsedProject.id}`);
      const entries = await fetchEntries.json();
      setEntries(entries);
    }

    fetchProjectAndEntries();
  }, [])


  async function handleOnClick() {
    const newEntryBody = { description: "Write a description here!", project_id: project?.id, user_id: user?.id };
    // post request to create new entry
    // setEntries((prev) => {
    //   const newEntries = [...prev];
    //   newEntries.push(newEntry);
    //   return newEntries;
    // })
  }

  return (
    <>
      {isLoggedIn ? <LoggedInHeader user={user} /> : <LoggedOutHeader />}
      <section className="project-container">
        <Link to={`/${username}`}>← Back</Link>
        {isProjectEditable ? <EditableProjectDescription project={project} setProject={setProject} projectImageURL={projectImageURL} setProjectImageURL={setProjectImageURL} setIsProjectEditable={setIsProjectEditable} /> : <ProjectDescription project={project} projectImageURL={projectImageURL} isSameUser={isSameUser} setIsProjectEditable={setIsProjectEditable} />}
        {isSameUser ? <button onClick={handleOnClick}>+ Create new entry</button> : null}
        {entries?.map((entry) => (
          <Entry entry={entry} key={entry.id} isSameUser={isSameUser} />
        ))}
      </section>
      {/* {viewerUserName}
      {projectOwnerName} */}
      {/* <button>add entry</button> */}
    </>
  )
};

export default Project;