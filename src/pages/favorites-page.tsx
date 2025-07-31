import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Search, Trash2, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { usePokemonFavorites } from "@/hooks/usePokemonData";
import { Pokemon } from "@/services/pokemonApi";

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

// 属性中文名映射
const TYPE_NAMES: Record<string, string> = {
    normal: "一般",
    fire: "火",
    water: "水",
    electric: "电",
    grass: "草",
    ice: "冰",
    fighting: "格斗",
    poison: "毒",
    ground: "地面",
    flying: "飞行",
    psychic: "超能力",
    bug: "虫",
    rock: "岩石",
    ghost: "幽灵",
    dragon: "龙",
    dark: "恶",
    steel: "钢",
    fairy: "妖精",
};

// 宝可梦中文名称映射（部分常见的）
const POKEMON_CHINESE_NAMES: Record<number, string> = {
    1: "妙蛙种子",
    4: "小火龙",
    7: "杰尼龟",
    25: "皮卡丘",
    150: "超梦",
    151: "梦幻",
    // 可以根据需要添加更多
};

export default function FavoritesPage() {
    const { favorites, toggleFavorite, getFavoritesList, favoritesCount } =
        usePokemonFavorites();
    const [favoritesPokemon, setFavoritesPokemon] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 获取收藏的宝可梦详细信息
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const pokemonList = await getFavoritesList();
                setFavoritesPokemon(pokemonList);
            } catch (err) {
                console.error("加载收藏列表失败:", err);
                setError("加载收藏列表失败，请稍后重试");
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();
    }, [getFavoritesList]);

    const handleRemoveFromFavorites = (pokemonId: number) => {
        toggleFavorite.mutate(pokemonId);
        // 从本地状态中移除
        setFavoritesPokemon((prev) =>
            prev.filter((pokemon) => pokemon.id !== pokemonId)
        );
    };

    const clearAllFavorites = () => {
        favoritesPokemon.forEach((pokemon) => {
            toggleFavorite.mutate(pokemon.id);
        });
        setFavoritesPokemon([]);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 面包屑导航 */}
            <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
                <Link to="/" className="hover:text-red-600">
                    首页
                </Link>
                <span>/</span>
                <span className="text-gray-900">我的收藏</span>
            </div>

            {/* 返回按钮 */}
            <Button variant="outline" className="mb-6" asChild>
                <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回首页
                </Link>
            </Button>

            {/* 页面标题 */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white fill-current" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            我的收藏
                        </h1>
                        <p className="text-gray-600">
                            已收藏 {favoritesCount} 只宝可梦
                        </p>
                    </div>
                </div>

                {/* 操作按钮 */}
                {favoritesCount > 0 && (
                    <div className="flex items-center space-x-2">
                        <Link to="/search">
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2"
                            >
                                <Search className="w-4 h-4" />
                                <span>继续收藏</span>
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={clearAllFavorites}
                            className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>清空收藏</span>
                        </Button>
                    </div>
                )}
            </div>

            {/* 加载状态 */}
            {isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
                <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* 空状态 */}
            {!isLoading && !error && favoritesCount === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        还没有收藏任何宝可梦
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        去搜索页面发现你喜欢的宝可梦，点击心形图标就可以添加到收藏夹了！
                    </p>
                    <Link to="/search">
                        <Button className="bg-red-500 hover:bg-red-600 text-white">
                            <Search className="w-4 h-4 mr-2" />
                            开始探索
                        </Button>
                    </Link>
                </div>
            )}

            {/* 收藏列表 */}
            {!isLoading && !error && favoritesPokemon.length > 0 && (
                <>
                    {/* 统计信息 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-red-600 mb-1">
                                    {favoritesCount}
                                </div>
                                <div className="text-sm text-gray-600">
                                    收藏总数
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                    {
                                        new Set(
                                            favoritesPokemon.flatMap(
                                                (p) =>
                                                    p.types?.map(
                                                        (t) => t.type.name
                                                    ) || []
                                            )
                                        ).size
                                    }
                                </div>
                                <div className="text-sm text-gray-600">
                                    属性类型
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600 mb-1">
                                    {Math.round(
                                        (favoritesCount / 1010) * 100 * 100
                                    ) / 100}
                                    %
                                </div>
                                <div className="text-sm text-gray-600">
                                    图鉴完成度
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600 mb-1">
                                    {favoritesPokemon.reduce(
                                        (sum, p) =>
                                            sum + (p.base_experience || 0),
                                        0
                                    )}
                                </div>
                                <div className="text-sm text-gray-600">
                                    总经验值
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 宝可梦卡片网格 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {favoritesPokemon.map((pokemon) => (
                            <Card
                                key={pokemon.id}
                                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative"
                            >
                                <CardContent className="p-4 text-center">
                                    {/* 移除收藏按钮 */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveFromFavorites(
                                                pokemon.id
                                            );
                                        }}
                                    >
                                        <Heart className="w-4 h-4 fill-current" />
                                    </Button>

                                    <Link to={`/pokemon/${pokemon.id}`}>
                                        <div className="relative mb-3">
                                            <img
                                                src={
                                                    (pokemon.sprites as any)
                                                        ?.other?.[
                                                        "official-artwork"
                                                    ]?.front_default ||
                                                    pokemon.sprites
                                                        ?.front_default ||
                                                    "/placeholder.svg?height=80&width=80"
                                                }
                                                alt={
                                                    POKEMON_CHINESE_NAMES[
                                                        pokemon.id
                                                    ] || pokemon.name
                                                }
                                                className="w-20 h-20 mx-auto object-contain group-hover:scale-110 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                            <div className="absolute -top-1 -left-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            #
                                            {pokemon.id
                                                .toString()
                                                .padStart(3, "0")}
                                        </h3>
                                        <h4 className="font-medium text-gray-800 mb-2 capitalize">
                                            {POKEMON_CHINESE_NAMES[
                                                pokemon.id
                                            ] || pokemon.name}
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
                                                    {TYPE_NAMES[
                                                        typeInfo.type.name
                                                    ] || typeInfo.type.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* 底部操作区 */}
                    <div className="mt-12 text-center">
                        <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                继续你的收藏之旅
                            </h3>
                            <p className="text-gray-600 mb-4">
                                还有更多精彩的宝可梦等待你去发现！
                            </p>
                            <Link to="/search">
                                <Button className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white">
                                    <Search className="w-4 h-4 mr-2" />
                                    探索更多宝可梦
                                </Button>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
