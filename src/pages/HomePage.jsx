import { useEffect, useState } from "react";
import User from "../components/User";
import Pagination from "../components/Pagination"

export default function HomePage() {
const [users, setUsers] = useState([ ]);
const [searchTerm, setSearchTerm] = useState("");
const [filter, setFilter] = useState("");
const [sortBy, setSortBy] = useState("name");

  console.log(users);

  useEffect(() => {
    getUsers();

    async function getUsers() {
        const data = localStorage.getItem("users");

        let usersData = [];

        if (data) {
            usersData = JSON.parse(data);
        } else {
            usersData = await fetchUsers();
        }

        usersData.sort((user1, user2) => user1.name.localeCompare(user2.name));
        console.log(usersData)
        setUsers(usersData);
      };

  }, []);

  async function fetchUsers() {
    const response = await fetch(
      "https://raw.githubusercontent.com/cederdorff/race/master/data/users.json"
    );
    const data = await response.json();
    localStorage.setItem("users", JSON.stringify(data));
    setUsers(data);
    
  };

    let filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const titles = [...new Set(users.map(user => user.title))];
    console.log(titles);

    if (filter != "") {
        filteredUsers = filteredUsers.filter(user => user.title === filter);
    }

    filteredUsers.sort((user1, user2) => user1[sortBy].localeCompare(user2[sortBy]))

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 3;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);



  return (
    <section className="page">
        <form className="grid-filter" role="search">
            <label>
                Search by Name <input placeholder="Search" type="search" onChange={e => setSearchTerm(e.target.value)}/>
            </label>
            <label>
                Filter by Title
                <select onChange={e => setFilter(e.target.value)}>
                    <option value="">Select title</option>
                    {titles.map(title => (
                        <option key={title} value={title}>
                            {title}
                        </option>
                    ))};
                </select>
            </label>
            <label>
                Sort by
                <select name="sort-by" onChange={e => setSortBy(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="title">Title</option>
                    <option value="mail">mail</option>
                </select>
            </label>
        </form>
      <section className="grid">
        {currentUsers.map(user => (
          <User key={user.id} user={user} />
        ))}
        </section>
        <Pagination
            usersPerPage={usersPerPage}
            totalUsers={users.length}
            paginate={paginate}
        />
    </section>
  )
}