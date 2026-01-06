import { useState } from "react";
import useDebounce from "../hooks/useDebounce";

interface User {
    id: number;
    name: string;
    type?: string;
}

const users: User[] = [
    { id: 1, name: "Hossein", type: "user" },
    { id: 2, name: "Ali", type: "user" },
    { id: 3, name: "Sara", type: "admin" },
    { id: 4, name: "Mohammad", type: "user" },
    { id: 5, name: "Reza", type: "user" },
];

const UserPage = () => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query);

    const filteredUsers = users.filter(user => {
        if (debouncedQuery.length < 2) return users;

        const q = debouncedQuery.toLowerCase();

        return (
            user.name.toLowerCase().includes(q) ||
            user.type?.toLowerCase().includes(q)
        );
    });


    return (
        <>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type name..."
            />

            <ul>
                {filteredUsers.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.type})
                    </li>
                ))}
            </ul>
        </>
    );
};

export default UserPage;
