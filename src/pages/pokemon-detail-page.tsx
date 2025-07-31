import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    GitCompare,
    Star,
    Zap,
    Shield,
    Swords,
    Activity,
    Eye,
    MapPin,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
    usePokemonDetail,
    usePokemonFavorites,
    handlePokemonApiError,
    getPokemonChineseName,
} from "@/hooks/usePokemonData";

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

const statNames: Record<string, string> = {
    hp: "HP",
    attack: "攻击",
    defense: "防御",
    "special-attack": "特攻",
    "special-defense": "特防",
    speed: "速度",
};

export default function PokemonDetailPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("overview");

    // API Hooks
    const pokemonId = parseInt(id || "1");
    const { data: pokemon, isLoading, error } = usePokemonDetail(pokemonId);
    const { isFavorite, toggleFavorite } = usePokemonFavorites();

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <Skeleton className="w-64 h-64 mx-auto mb-6" />
                                <Skeleton className="h-8 w-48 mx-auto mb-4" />
                                <Skeleton className="h-6 w-32 mx-auto mb-4" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-16" />
                                    <Skeleton className="h-16" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                        <Skeleton className="h-12 w-full mb-6" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !pokemon) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Button variant="outline" className="mb-6" asChild>
                    <Link to="/search">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        返回搜索
                    </Link>
                </Button>
                <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                        {error
                            ? handlePokemonApiError(error)
                            : "未找到该宝可梦"}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 面包屑导航 */}
            <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
                <Link to="/" className="hover:text-red-600">
                    首页
                </Link>
                <span>/</span>
                <Link to="/search" className="hover:text-red-600">
                    搜索
                </Link>
                <span>/</span>
                <span className="text-gray-900">
                    {getPokemonChineseName(pokemon.name)}
                </span>
            </div>

            {/* 返回按钮 */}
            <Button variant="outline" className="mb-6" asChild>
                <Link to="/search">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回搜索
                </Link>
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* 左侧：宝可梦图片和基本信息 */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6 text-center">
                            {/* 宝可梦图片 */}
                            <div className="relative mb-6">
                                <img
                                    src={
                                        pokemon.sprites?.other?.[
                                            "official-artwork"
                                        ]?.front_default ||
                                        pokemon.sprites?.front_default ||
                                        "/placeholder.svg?height=300&width=300"
                                    }
                                    alt={pokemon.name}
                                    className="w-64 h-64 mx-auto object-contain"
                                />
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant={
                                            isFavorite(pokemon.id)
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            toggleFavorite.mutate(pokemon.id)
                                        }
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${
                                                isFavorite(pokemon.id)
                                                    ? "fill-current"
                                                    : ""
                                            }`}
                                        />
                                    </Button>
                                    <Link to={`/compare?pokemon=${pokemon.id}`}>
                                        <Button size="sm" variant="outline">
                                            <GitCompare className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* 基本信息 */}
                            <div className="text-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    #{pokemon.id.toString().padStart(3, "0")}{" "}
                                    {getPokemonChineseName(pokemon.name)}
                                </h1>
                                <p className="text-lg text-gray-600 mb-4">
                                    {getPokemonChineseName(pokemon.name)}
                                </p>
                                <div className="flex justify-center gap-2 mb-4">
                                    {pokemon.types?.map((typeInfo) => (
                                        <Badge
                                            key={typeInfo.type.name}
                                            className={`${
                                                TYPE_COLORS[
                                                    typeInfo.type.name
                                                ] || "bg-gray-400"
                                            } text-white px-3 py-1`}
                                        >
                                            {TYPE_NAMES[typeInfo.type.name] ||
                                                typeInfo.type.name}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-2">宝可梦</p>
                            </div>

                            {/* 物理特征 */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="font-semibold text-gray-900">
                                        身高
                                    </div>
                                    <div className="text-gray-600">
                                        {(pokemon.height / 10).toFixed(1)} m
                                    </div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="font-semibold text-gray-900">
                                        体重
                                    </div>
                                    <div className="text-gray-600">
                                        {(pokemon.weight / 10).toFixed(1)} kg
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 右侧：详细信息标签页 */}
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">概览</TabsTrigger>
                            <TabsTrigger value="stats">能力值</TabsTrigger>
                            <TabsTrigger value="moves">技能</TabsTrigger>
                            <TabsTrigger value="evolution">进化</TabsTrigger>
                        </TabsList>

                        {/* 概览标签 */}
                        <TabsContent value="overview" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>图鉴描述</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">
                                        这是一只
                                        {TYPE_NAMES[
                                            pokemon.types?.[0]?.type.name
                                        ] || pokemon.types?.[0]?.type.name}
                                        属性的宝可梦。 身高
                                        {(pokemon.height / 10).toFixed(1)}
                                        米，体重
                                        {(pokemon.weight / 10).toFixed(1)}公斤。
                                        {pokemon.types?.length > 1 &&
                                            `同时具有${
                                                TYPE_NAMES[
                                                    pokemon.types[1].type.name
                                                ] || pokemon.types[1].type.name
                                            }属性。`}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>特性</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {pokemon.abilities?.map(
                                            (abilityInfo) => (
                                                <div
                                                    key={
                                                        abilityInfo.ability.name
                                                    }
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Zap className="w-4 h-4 text-yellow-500" />
                                                    <span className="capitalize">
                                                        {
                                                            abilityInfo.ability
                                                                .name
                                                        }
                                                    </span>
                                                    {abilityInfo.is_hidden && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            隐藏特性
                                                        </Badge>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>基础经验值</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-2">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span>
                                            基础经验值:{" "}
                                            {pokemon.base_experience || "未知"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* 能力值标签 */}
                        <TabsContent value="stats">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Activity className="w-5 h-5 mr-2" />
                                        种族值分布
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {pokemon.stats?.map((statInfo) => (
                                            <div
                                                key={statInfo.stat.name}
                                                className="flex items-center space-x-4"
                                            >
                                                <div className="w-16 text-sm font-medium">
                                                    {statNames[
                                                        statInfo.stat.name
                                                    ] || statInfo.stat.name}
                                                </div>
                                                <div className="w-12 text-right text-sm font-mono">
                                                    {statInfo.base_stat}
                                                </div>
                                                <div className="flex-1">
                                                    <Progress
                                                        value={
                                                            (statInfo.base_stat /
                                                                150) *
                                                            100
                                                        }
                                                        className="h-2"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <div className="pt-4 border-t">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold">
                                                    种族值总和
                                                </span>
                                                <span className="text-lg font-bold text-red-600">
                                                    {pokemon.stats?.reduce(
                                                        (sum, stat) =>
                                                            sum +
                                                            stat.base_stat,
                                                        0
                                                    ) || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* 技能标签 */}
                        <TabsContent value="moves">
                            <Card>
                                <CardHeader>
                                    <CardTitle>等级技能</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2">
                                                        技能名称
                                                    </th>
                                                    <th className="text-left py-2">
                                                        学习方式
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pokemon.moves
                                                    ?.slice(0, 10)
                                                    .map(
                                                        (
                                                            moveInfo: any,
                                                            index: number
                                                        ) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b hover:bg-gray-50"
                                                            >
                                                                <td className="py-2 font-medium">
                                                                    {moveInfo.move.name.replace(
                                                                        /-/g,
                                                                        " "
                                                                    )}
                                                                </td>
                                                                <td className="py-2">
                                                                    {moveInfo
                                                                        .version_group_details?.[0]
                                                                        ?.move_learn_method
                                                                        ?.name ===
                                                                    "level-up"
                                                                        ? "升级学会"
                                                                        : moveInfo
                                                                              .version_group_details?.[0]
                                                                              ?.move_learn_method
                                                                              ?.name ===
                                                                          "machine"
                                                                        ? "技能机器"
                                                                        : moveInfo
                                                                              .version_group_details?.[0]
                                                                              ?.move_learn_method
                                                                              ?.name ===
                                                                          "egg"
                                                                        ? "遗传技能"
                                                                        : moveInfo
                                                                              .version_group_details?.[0]
                                                                              ?.move_learn_method
                                                                              ?.name ||
                                                                          "未知"}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                            </tbody>
                                        </table>
                                        {pokemon.moves &&
                                            pokemon.moves.length > 10 && (
                                                <p className="text-sm text-gray-500 mt-2 text-center">
                                                    显示前10个技能，共
                                                    {pokemon.moves.length}个技能
                                                </p>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* 进化标签 */}
                        <TabsContent value="evolution">
                            <Card>
                                <CardHeader>
                                    <CardTitle>进化信息</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <div className="relative p-4 rounded-lg border-2 border-red-500 bg-red-50 inline-block">
                                            <img
                                                src={
                                                    pokemon.sprites?.other?.[
                                                        "official-artwork"
                                                    ]?.front_default ||
                                                    pokemon.sprites
                                                        ?.front_default ||
                                                    "/placeholder.svg?height=120&width=120"
                                                }
                                                alt={pokemon.name}
                                                className="w-24 h-24 object-contain"
                                            />
                                            <div className="absolute -top-2 -right-2">
                                                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="font-medium text-lg">
                                                {getPokemonChineseName(
                                                    pokemon.name
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                当前宝可梦
                                            </div>
                                        </div>
                                        <p className="text-gray-500 mt-4">
                                            进化链信息需要额外的API调用获取，当前显示基础信息。
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
