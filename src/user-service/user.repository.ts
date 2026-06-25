export interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [
  { id: "1", name: "Rahim Uddin", email: "rahim@shop.com" },
  { id: "2", name: "Karim Hossain", email: "karim@shop.com" },
];

export const userRepository = {
  findById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  },
};
