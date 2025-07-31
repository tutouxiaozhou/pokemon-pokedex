import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Search,
    Heart,
    GitCompare,
    TrendingUp,
    Star,
    Zap,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { pokemonApi } from "@/services/pokemonApi";

// 热门宝可梦ID列表
const FEATURED_POKEMON_IDS = [1, 4, 7, 25, 150, 151];

// 属性类型映射
const TYPE_COLORS: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-green-400",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
};

// 宝可梦中文名称映射
const POKEMON_CHINESE_NAMES: Record<number, string> = {
    1: "妙蛙种子",
    4: "小火龙",
    7: "杰尼龟",
    25: "皮卡丘",
    150: "超梦",
    151: "梦幻",
};

interface FeaturedPokemon {
    id: number;
    name: string;
    chineseName: string;
    types: Array<{ type: { name: string } }>;
    sprites: { front_default: string };
}

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [featuredPokemon, setFeaturedPokemon] = useState<FeaturedPokemon[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // 获取热门宝可梦数据
    useEffect(() => {
        const fetchFeaturedPokemon = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const pokemonPromises = FEATURED_POKEMON_IDS.map((id) =>
                    pokemonApi.getPokemonById(id)
                );

                const pokemonData = await Promise.all(pokemonPromises);

                const formattedData: FeaturedPokemon[] = pokemonData.map(
                    (pokemon) => ({
                        id: pokemon.id,
                        name: pokemon.name,
                        chineseName:
                            POKEMON_CHINESE_NAMES[pokemon.id] || pokemon.name,
                        types: pokemon.types,
                        sprites: pokemon.sprites,
                    })
                );

                setFeaturedPokemon(formattedData);
            } catch (err) {
                console.error("获取热门宝可梦失败:", err);
                setError("加载热门宝可梦失败，请稍后重试");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedPokemon();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="space-y-12">
            {/* 英雄区域 */}
            <section className="relative py-20 px-4 text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-blue-500/10 to-yellow-500/10 rounded-3xl mx-4 mt-4"></div>
                <div className="relative container mx-auto max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        探索宝可梦的
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                            奇妙世界
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        全面的宝可梦图鉴数据库，包含详细的属性信息、进化链、技能学习和栖息地分布
                    </p>

                    {/* 快速搜索 */}
                    <form onSubmit={handleSearch} className="max-w-lg mx-auto">
                        <div className="flex items-center bg-white rounded-full border-2 border-gray-200 hover:border-gray-300 focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100 transition-all duration-300 shadow-lg">
                            <Search className="ml-4 text-gray-400 w-5 h-5 flex-shrink-0" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="搜索你喜欢的宝可梦..."
                                className="flex-1 border-0 bg-transparent px-4 py-4 text-lg placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
                            />
                            <Button
                                type="submit"
                                className="px-6 py-2 h-10 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition-all duration-200 hover:scale-105"
                            >
                                搜索
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            {/* 特色功能区 */}
            <section className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    核心功能
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-xl">智能搜索</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-600 mb-4">
                                支持按名称、属性、世代等多维度搜索，实时建议和高级筛选
                            </p>
                            <Link to="/search">
                                <Button
                                    variant="outline"
                                    className="group-hover:bg-blue-50"
                                >
                                    开始搜索
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-xl">收藏管理</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-600 mb-4">
                                个人收藏夹管理，图鉴完成度统计，收藏进度可视化
                            </p>
                            <Link to="/favorites">
                                <Button
                                    variant="outline"
                                    className="group-hover:bg-red-50"
                                >
                                    我的收藏
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <GitCompare className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-xl">属性对比</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-600 mb-4">
                                支持多个宝可梦的属性对比，能力值分析和技能差异展示
                            </p>
                            <Link to="/compare">
                                <Button
                                    variant="outline"
                                    className="group-hover:bg-yellow-50"
                                >
                                    开始对比
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* 热门宝可梦展示 */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        热门宝可梦
                    </h2>
                    <Link to="/search">
                        <Button
                            variant="outline"
                            className="flex items-center space-x-2"
                        >
                            <TrendingUp className="w-4 h-4" />
                            <span>查看更多</span>
                        </Button>
                    </Link>
                </div>

                {/* 加载状态 */}
                {isLoading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Card key={index}>
                                <CardContent className="p-4 text-center">
                                    <Skeleton className="w-20 h-20 mx-auto mb-3" />
                                    <Skeleton className="h-4 w-12 mx-auto mb-1" />
                                    <Skeleton className="h-4 w-16 mx-auto mb-2" />
                                    <Skeleton className="h-6 w-10 mx-auto" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* 错误状态 */}
                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                        >
                            重新加载
                        </Button>
                    </div>
                )}

                {/* 宝可梦卡片 */}
                {!isLoading && !error && featuredPokemon.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {featuredPokemon.map((pokemon) => (
                            <Link
                                key={pokemon.id}
                                to={`/pokemon/${pokemon.id}`}
                            >
                                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                                    <CardContent className="p-4 text-center">
                                        <div className="relative mb-3">
                                            <img
                                                src={
                                                    pokemon.sprites
                                                        ?.front_default ||
                                                    "/placeholder.svg?height=80&width=80"
                                                }
                                                alt={pokemon.chineseName}
                                                className="w-20 h-20 mx-auto object-contain group-hover:scale-110 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                            <div className="absolute -top-1 -right-1">
                                                {/* <Star className="w-4 h-4 text-yellow-500 fill-current" /> */}
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            #
                                            {pokemon.id
                                                .toString()
                                                .padStart(3, "0")}
                                        </h3>
                                        <h4 className="font-medium text-gray-800 mb-2">
                                            {pokemon.chineseName}
                                        </h4>
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {pokemon.types?.map((typeInfo) => (
                                                <Badge
                                                    key={typeInfo.type.name}
                                                    className={`${
                                                        TYPE_COLORS[
                                                            typeInfo.type.name
                                                        ] || "bg-gray-400"
                                                    } text-white text-xs px-2 py-1`}
                                                >
                                                    {typeInfo.type.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* 统计数据区 */}
            <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        图鉴统计
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    1010+
                                </div>
                                <div className="text-gray-600">宝可梦总数</div>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    18
                                </div>
                                <div className="text-gray-600">属性类型</div>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    9
                                </div>
                                <div className="text-gray-600">世代数量</div>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <GitCompare className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    800+
                                </div>
                                <div className="text-gray-600">技能总数</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
