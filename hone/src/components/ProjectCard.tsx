import { User, Project } from "../globals";
import { FC, useEffect, useState } from "react";
import "../styles/projectCard.css";
import { useNavigate } from "react-router-dom";

type Props = {
  project: Project;
  user: User | null;
}


const ProjectCard: FC<Props> = ({ project, user }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string>("https://htmlcolorcodes.com/assets/images/colors/light-gray-color-solid-background-1920x1080.png");

  useEffect(() => {
    async function fetchImage() {
      if (project.img_id != null) {
        const result = await fetch(`http://localhost:8080/images/${project.img_id}`);
        const img = await result.json();
        setImage(img.url);
      }
    }

    fetchImage();
  }, []);

  return (
    <article className="project-card-container" onClick={() => navigate(`/${user?.user_name}/${project.id}`)}>
      <img className="project-img" src={image} alt="user-artwork" />
      <h2 className="project-title">{project.title} →</h2>
    </article>
  )
};

export default ProjectCard;