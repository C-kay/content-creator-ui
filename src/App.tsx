import ContentCreator from "./components/ContentCreator";
import logo from './assets/content_creator_logo.png';

export default function App() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto">
        <img
          src={logo}
          alt="Content Creator Logo"
          className="mx-auto mb-4 w-57 h-auto"
        />
        <ContentCreator />
      </div>
    </main>
  )
}