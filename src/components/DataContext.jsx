import React, { createContext, useState, useEffect } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, userRes] = await Promise.all([
          fetch("http://localhost:3000/categories"),
          fetch("http://localhost:3000/users"),
        ]);

        const catData = await catRes.json();
        const userData = await userRes.json();

        const catMap = {};
        catData.forEach((cat) => (catMap[cat.id] = cat.name));

        const userMap = {};
        userData.forEach((user) => (userMap[user.id] = user));

        setCategories(catMap);
        setUsers(userMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ categories, users, loading }}>
      {children}
    </DataContext.Provider>
  );
};
