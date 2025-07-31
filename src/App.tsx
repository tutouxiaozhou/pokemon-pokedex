import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home-page";
import SearchPageWithApi from "@/pages/search-page-with-api";
import PokemonDetailPage from "@/pages/pokemon-detail-page";
import FavoritesPage from "@/pages/favorites-page";
import ComparePage from "@/pages/compare-page";
import Layout from "@/layout";

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="pokemon-ui-theme">
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<SearchPageWithApi />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/compare" element={<ComparePage />} />
                        <Route
                            path="/pokemon/:id"
                            element={<PokemonDetailPage />}
                        />
                    </Routes>
                </Layout>
            </Router>
            <Toaster />
        </ThemeProvider>
    );
}

export default App;
