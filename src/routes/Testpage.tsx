import { useState } from "react";
import TextInput from "../components/TextInput";

function WellcomeFn(text: string): string {
  return `Hello ${text}`;
}

interface User {
  id: number;
  name: string;
  family: string;
  email: string;
}

const defUserValue: User = {
  id: 0,
  name: "",
  family: "",
  email: "",
};

const TestPage = () => {
  const [userData, setUserData] = useState<User>(defUserValue);

  const [usersData, setUsersData] = useState<User[]>([]);

  function handleChange(name: string, value: string): void {
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function addUser(user: User): void {
    setUsersData((prevState) => [...prevState, { ...user, id: Date.now() }]);
    setUserData(defUserValue);
  }

  return (
    <>
      <h1>test page</h1>
      <h2>{WellcomeFn("jafar")}</h2>
      <h1>User List : {usersData.length}</h1>

      <div className="flex gap-4">
        <TextInput
          placeholder="name"
          value={userData.name}
          onChange={(v) => handleChange("name", v)}
        />

        <TextInput
          placeholder="family"
          value={userData.family}
          onChange={(v) => handleChange("family", v)}
        />

        <TextInput
          type="email"
          placeholder="email"
          value={userData.email}
          onChange={(v) => handleChange("email", v)}
        />

        <button
          disabled={!userData.name || !userData.family || !userData.email}
          onClick={() => addUser(userData)}
          className="bg-blue-500 text-white p-2 rounded-sm cursor-pointer
           disabled:bg-gray-300 disabled:text-gray-500
             disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      <ul>
        {usersData.map((user) => (
          <li key={user.id}>
            {user.id} :
            <b>
              {user.name} {user.family} {user.email}
            </b>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TestPage;
