import React, { MouseEventHandler, useState } from "react";
import FormField from "./FormField";
import { groupBy, last, initial } from "lodash";

interface FactFormProps {
  prompt: (promptString: string) => Promise<string[]>;
  set: (key: string, value: string) => void;
  get: (key: string) => string | null;
}

interface Project {
  name: string;
  description: string;
  company: string;
}

const FactForm: React.FC<FactFormProps> = ({ prompt, set, get }) => {
  const [results, setResults] = useState<string[]>([]);

  const [name, setName] = useState<string>(get("name") || "");
  const [company, setCompany] = useState<string>(get("company") || "");
  const [role, setRole] = useState<string>(get("role") || "");

  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectCompany, setProjectCompany] = useState<string>("");

  const [skill, setSkill] = useState<string>("");

  const [tone, setTone] = useState<string>(get("tone") || "");

  const [isLoading, setIsLoading] = useState(false);

  const loadProjects = () => {
    const projects = get("projects");
    if (projects) return JSON.parse(projects);
    return [];
  };

  const loadSkills = () => {
    const skills = get("skills");
    if (skills) return JSON.parse(skills);
    return [];
  };

  const [projects, setProjects] = useState<Project[]>(loadProjects());
  const [skills, setSkills] = useState<string[]>(loadSkills());

  const [newCompany, setNewCompany] = useState<string>(get("newCompany") || "");
  const [newRole, setNewRole] = useState<string>(get("newRole") || "");

  const describeCompanyProjects = (
    company: string,
    projects: Project[]
  ): string => {
    const prefix = `At ${company} I worked on `;
    const middleProjects: Project[] = initial(projects);
    const lastProject: Project = last(projects);

    const middle = middleProjects
      .map((project) => `${project.name}, ${project.description}`)
      .join("; ");

    const suffix = `and ${lastProject.name}, ${lastProject.description}.`;

    return prefix + middle + suffix;
  };

  const removeProject = (project: Project) => {
    const remainingProjects = projects.filter(
      (it) => it.name !== project.name && it.description !== project.description
    );

    setProjects(remainingProjects);
    set("projects", JSON.stringify(remainingProjects));
  };

  const removeSkill = (skill: string) => {
    const remainingSkills = skills.filter((it) => it !== skill);

    setSkills(remainingSkills);
    set("skills", JSON.stringify(remainingSkills));
  };

  const promptString = () => {
    const basics = [
      `I am ${name}.`,
      `I work for ${company}.`,
      `My role at ${company} is ${role}.`,
      `I am a ${tone} person.`
    ];

    const companyProjects = groupBy(projects, "company");
    const companies = Object.keys(companyProjects);

    const projectsWorkedOn = companies.map((company) =>
      describeCompanyProjects(company, companyProjects[company])
    );

    const skillsIHave = skills.map((it) => `I am skilled with ${it}.`);

    const newJobDetails = [
      `I am applying to the company ${newCompany}.`,
      `I am applying for the ${newRole} job at ${newCompany}.`
    ];

    const command = [
      `Write a cover letter for the job at ${newCompany} emphasizing my ${tone} personality.`,
      `In the cover letter, display as much knowledge of ${newCompany} as possible.`
    ];

    return basics
      .concat(projectsWorkedOn)
      .concat(skillsIHave)
      .concat(newJobDetails)
      .concat(command)
      .join("\n");
  };

  const doPrompt: MouseEventHandler<HTMLButtonElement> = (e) => {
    setIsLoading(true);
    prompt(promptString()).then((chunks: string[]) => {
      setResults(chunks);
      setIsLoading(false);
    });
  };

  const getMore = () => {
    const completePrompt = [promptString(), ...results].join("\n");
    setIsLoading(true);
    prompt(completePrompt).then((chunks: string[]) => {
      setResults([...results, ...chunks]);
      setIsLoading(false);
    });
  };

  const setNewProject = (e) => {
    e.preventDefault();

    if (!projectName) return;

    const newProject = {
      name: projectName,
      description: projectDescription,
      company: projectCompany
    };

    const allProjects = [newProject, ...projects];

    setProjects(allProjects);

    setProjectName("");
    setProjectDescription("");
    setProjectCompany("");

    set("projects", JSON.stringify(allProjects));
  };

  const setNewSkill = (e) => {
    e.preventDefault();

    if (!skill) return;

    const allSkills = [skill, ...skills];

    setSkills(allSkills);

    setSkill("");

    set("skills", JSON.stringify(skills));
  };

  return (
    <>
      <form>
        <FormField
          fieldId="name"
          value={name}
          onInput={setName}
          placeholder="name"
          label="My name is"
          onBlur={() => set("name", name)}
          required
        />

        <FormField
          fieldId="company"
          value={company}
          onInput={setCompany}
          placeholder="company"
          label="My company is"
          onBlur={() => set("company", company)}
          required
        />

        <FormField
          fieldId="role"
          value={role}
          onInput={setRole}
          placeholder="role"
          label="My role is"
          onBlur={() => set("role", role)}
          required
        />

        <div>
          {projects.length > 0 && (
            <>
              I have worked on the following projects
              <ul>
                {projects.map((project) => {
                  return (
                    <li key={project.name}>
                      <div className="d-inline-block">
                        {`${project.name}${project.description ? ", " : ""}${
                          project.description
                        }`}
                      </div>

                      <div className="d-inline-block pull-right">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeProject(project)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <FormField
          fieldId="projectName"
          value={projectName}
          onInput={setProjectName}
          placeholder="project name"
          label="My last project was called"
          required={false}
        />

        <FormField
          fieldId="projectDescription"
          value={projectDescription}
          onInput={setProjectDescription}
          placeholder="project description"
          label="My last project was concerned with"
          required={false}
        />

        <FormField
          fieldId="projectCompany"
          value={projectCompany}
          onInput={setProjectCompany}
          placeholder="project company"
          label="The company where you worked on this project"
          required={false}
        />

        <button className="btn btn-primary" onClick={setNewProject}>
          Add Project
        </button>

        <div>
          {skills.length > 0 && (
            <>
              I have the following skills
              <ul>
                {skills.map((skill) => {
                  return (
                    <li key={skill}>
                      {skill}

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeSkill(skill)}
                      >
                        Delete
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <FormField
          fieldId="skill"
          value={skill}
          onInput={setSkill}
          placeholder="skill name"
          label="I am skilled with"
          required={false}
        />

        <button className="btn btn-primary" onClick={setNewSkill}>
          Add Skill
        </button>

        <FormField
          fieldId="newCompany"
          value={newCompany}
          onInput={setNewCompany}
          placeholder="new company name"
          label="The company I am applying to is called"
          onBlur={() => set("newCompany", newCompany)}
          required
        />

        <FormField
          fieldId="newRole"
          value={newRole}
          onInput={setNewRole}
          placeholder="new role"
          label="The role I am applying for is"
          onBlur={() => set("newRole", newRole)}
          required
        />

        <label htmlFor="tone">Tone</label>
        <select
          className="form-select"
          id="tone"
          aria-label="Default select example"
          onChange={(e) => {
            setTone(e.target.value);
            set("tone", e.target.value);
          }}
          defaultValue={tone}
        >
          {[
            "intelligent",
            "unintelligent",
            "big dick energy",
            "scholarly and intelligent"
          ].map((choice) => (
            <option value={choice}>{choice}</option>
          ))}
        </select>
      </form>

      <button className="btn btn-primary" onClick={doPrompt}>
        Submit
      </button>

      <button className="btn btn-primary" onClick={getMore}>
        More
      </button>

      {isLoading && <div>Loading</div>}
      {!isLoading && results.map((result) => <pre key={result}>{result}</pre>)}
    </>
  );
};

export default FactForm;
