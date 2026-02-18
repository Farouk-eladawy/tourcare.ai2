import React, { useState, useEffect, useMemo } from 'react';
import { AdminDashboardContent, User } from '../types';
import { fetchAllUsers } from '../lib/api';
import ParticlesBackground from '../components/ParticlesBackground';

interface AdminDashboardPageProps {
  content: AdminDashboardContent;
  onImpersonate: (user: User) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ content, onImpersonate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchAllUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load users.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowercasedTerm = searchTerm.toLowerCase();
    return users.filter(user =>
      user.fields.name.toLowerCase().includes(lowercasedTerm) ||
      user.fields.Email.toLowerCase().includes(lowercasedTerm)
    );
  }, [users, searchTerm]);

  const handleImpersonateClick = (user: User) => {
    setImpersonatingId(user.id);
    // Simulate a small delay for user feedback
    setTimeout(() => {
        onImpersonate(user);
    }, 500);
  };

  return (
    <section className="relative py-16 bg-brand-light-gray min-h-screen">
      <ParticlesBackground id="particles-admin" />
      <div className="relative container mx-auto px-6 z-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{content.pageTitle}</h1>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/80">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <input
              type="search"
              placeholder={content.searchPlaceholder}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 bg-gray-100 border-2 border-gray-200 rounded-md p-3 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
            />
            <div className="text-lg font-semibold text-gray-700">
              {content.totalUsers.replace('{{count}}', filteredUsers.length.toString())}
            </div>
          </div>

          {isLoading && <p>Loading users...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          {!isLoading && !error && (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">{content.tableHeaders.name}</th>
                    <th className="p-4 font-semibold text-gray-600">{content.tableHeaders.email}</th>
                    <th className="p-4 font-semibold text-gray-600">{content.tableHeaders.role}</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">{content.tableHeaders.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{user.fields.name}</td>
                      <td className="p-4 text-gray-600">{user.fields.Email}</td>
                      <td className="p-4">
                        {user.fields.isAdmin ? (
                          <span className="px-2 py-1 text-xs font-bold text-green-800 bg-green-200 rounded-full">{content.roleAdmin}</span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">{content.roleUser}</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleImpersonateClick(user)}
                          disabled={impersonatingId === user.id}
                          className="bg-brand-accent text-white font-bold px-4 py-2 rounded-md hover:bg-brand-accent-hover transition text-sm disabled:bg-gray-400"
                        >
                          {impersonatingId === user.id ? content.loggingIn : content.loginAsButton}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
           {filteredUsers.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <p className="text-gray-600 text-lg">No users found.</p>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;