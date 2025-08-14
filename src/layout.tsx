import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, GitCompare, Home, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get("search") as string;
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
            {/* 顶部导航栏 */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full border-2 border-red-600"></div>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            宝可梦图鉴
                        </span>
                    </Link>

                    {/* 主导航 */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>首页</span>
                        </Link>
                        <Link
                            to="/search"
                            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            <span>搜索</span>
                        </Link>
                        <Link
                            to="/favorites"
                            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <Heart className="w-4 h-4" />
                            <span>收藏</span>
                        </Link>
                        <Link
                            to="/compare"
                            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <GitCompare className="w-4 h-4" />
                            <span>对比</span>
                        </Link>
                        <Link
                            to="/team-builder"
                            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <Users className="w-4 h-4" />
                            <span>队伍构建</span>
                        </Link>
                    </nav>

                    {/* 搜索框 */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex items-center space-x-2"
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                name="search"
                                placeholder="搜索宝可梦..."
                                className="pl-10 w-64"
                            />
                        </div>
                    </form>

                    {/* 用户头像 */}
                    <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>
                            <User className="w-4 h-4" />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </header>

            {/* 主要内容 */}
            <main className="flex-1">{children}</main>

            {/* 底部信息栏 */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-white rounded-full border-2 border-red-600"></div>
                            </div>
                            <span className="text-lg font-semibold">
                                宝可梦图鉴
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">
                            © 2025 宝可梦图鉴网站. 本网站仅供学习交流使用.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
