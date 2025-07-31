/**
 * 宝可梦搜索页面 - 集成真实API
 * 使用官方PokéAPI获取数据
 */

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    Grid,
    List,
    Star,
    Zap,
    RefreshCw,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useSearchPokemon,
    usePokemonByType,
    useRandomPokemon,
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

// 属性类型中英文映射
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

const POKEMON_TYPES = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
];

export default function SearchPageWithApi() {
    const navigate = useNavigate();

    // 状态管理
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState<"id" | "name" | "hp" | "attack">("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // API Hooks
    const searchResults = useSearchPokemon(searchQuery, 50);
    const typeResults = usePokemonByType(selectedType);
    const randomPokemon = useRandomPokemon(12, !searchQuery && !selectedType);
    const { isFavorite, toggleFavorite } = usePokemonFavorites();

    // 确定当前显示的数据
    const currentData = useMemo(() => {
        if (searchQuery && searchResults.data) {
            return searchResults.data;
        }
        if (selectedType && typeResults.data) {
            return typeResults.data;
        }
        if (randomPokemon.data) {
            return randomPokemon.data;
        }
        return [];
    }, [
        searchQuery,
        searchResults.data,
        selectedType,
        typeResults.data,
        randomPokemon.data,
    ]);

    // 加载状态
    const isLoading =
        searchResults.isLoading ||
        typeResults.isLoading ||
        randomPokemon.isLoading;

    // 错误状态
    const error =
        searchResults.error || typeResults.error || randomPokemon.error;

    // 排序和分页处理
    const sortedAndPaginatedResults = useMemo(() => {
        let sorted = [...currentData];

        // 排序
        sorted.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case "id":
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case "name":
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case "hp":
                    aValue =
                        a.stats.find((s) => s.stat.name === "hp")?.base_stat ||
                        0;
                    bValue =
                        b.stats.find((s) => s.stat.name === "hp")?.base_stat ||
                        0;
                    break;
                case "attack":
                    aValue =
                        a.stats.find((s) => s.stat.name === "attack")
                            ?.base_stat || 0;
                    bValue =
                        b.stats.find((s) => s.stat.name === "attack")
                            ?.base_stat || 0;
                    break;
                default:
                    return 0;
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        // 分页
        const itemsPerPage = 12;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return {
            items: sorted.slice(startIndex, endIndex),
            totalPages: Math.ceil(sorted.length / itemsPerPage),
            totalItems: sorted.length,
        };
    }, [currentData, sortBy, sortOrder, currentPage]);

    // 重置筛选
    const resetFilters = () => {
        setSearchQuery("");
        setSelectedType("");
        setCurrentPage(1);
    };

    // 防抖搜索
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedType]);

    // 处理宝可梦卡片点击
    const handlePokemonClick = (pokemonId: number) => {
        navigate(`/pokemon/${pokemonId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* 页面标题 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        宝可梦搜索
                    </h1>
                    <p className="text-lg text-gray-600">
                        搜索和发现你喜欢的宝可梦 - 数据来源：PokéAPI
                    </p>
                </div>

                {/* 搜索栏 */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex gap-3 items-center">
                            <div className="flex-1 relative">
                                <div className="flex items-center bg-white rounded-lg border border-gray-200 hover:border-gray-300 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all duration-200">
                                    <Search className="ml-3 text-gray-400 w-5 h-5 flex-shrink-0" />
                                    <Input
                                        placeholder="搜索宝可梦名称、编号或中文名..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="flex-1 border-0 bg-transparent pl-3 pr-3 py-3 text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                    <Button
                                        onClick={() => {
                                            if (searchQuery.trim()) {
                                                // 触发搜索
                                            }
                                        }}
                                        className="mr-2 px-4 py-2 h-8 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors duration-200"
                                    >
                                        搜索
                                    </Button>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 h-12 px-4 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                            >
                                <Filter className="w-4 h-4" />
                                筛选
                            </Button>
                            <Button
                                onClick={resetFilters}
                                variant="outline"
                                className="flex items-center gap-2 h-12 px-4 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                            >
                                <RefreshCw className="w-4 h-4" />
                                重置
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 高级筛选面板 */}
                {showFilters && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>筛选选项</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* 属性筛选 */}
                            <div>
                                <h3 className="text-sm font-medium mb-3">
                                    按属性筛选
                                </h3>
                                <Select
                                    value={selectedType}
                                    onValueChange={setSelectedType}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择属性类型" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">
                                            全部属性
                                        </SelectItem>
                                        {POKEMON_TYPES.map((type) => (
                                            <SelectItem
                                                key={type}
                                                value={type}
                                                className="capitalize"
                                            >
                                                {TYPE_NAMES[type] || type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 搜索结果控制栏 */}
                {currentData.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="text-sm text-gray-600">
                            找到 {sortedAndPaginatedResults.totalItems} 个结果
                            {searchQuery && ` - 搜索: "${searchQuery}"`}
                            {selectedType &&
                                ` - 属性: ${
                                    TYPE_NAMES[selectedType] || selectedType
                                }`}
                        </div>

                        <div className="flex items-center gap-4">
                            {/* 排序选择 */}
                            <Select
                                value={sortBy}
                                onValueChange={(value: any) => setSortBy(value)}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="id">编号</SelectItem>
                                    <SelectItem value="name">名称</SelectItem>
                                    <SelectItem value="hp">HP</SelectItem>
                                    <SelectItem value="attack">
                                        攻击力
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setSortOrder(
                                        sortOrder === "asc" ? "desc" : "asc"
                                    )
                                }
                            >
                                {sortOrder === "asc" ? "↑" : "↓"}
                            </Button>

                            {/* 视图切换 */}
                            <div className="flex border rounded-lg">
                                <Button
                                    variant={
                                        viewMode === "grid"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={
                                        viewMode === "list"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 错误提示 */}
                {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">
                            {handlePokemonApiError(error)}
                        </AlertDescription>
                    </Alert>
                )}

                {/* 加载状态 */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Card key={index}>
                                <CardContent className="p-4">
                                    <Skeleton className="h-32 w-full mb-4" />
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* 搜索结果 */}
                {!isLoading && currentData.length > 0 && (
                    <>
                        <div
                            className={`grid gap-6 mb-8 ${
                                viewMode === "grid"
                                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    : "grid-cols-1"
                            }`}
                        >
                            {sortedAndPaginatedResults.items.map((pokemon) => (
                                <Card
                                    key={pokemon.id}
                                    className="hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() =>
                                        handlePokemonClick(pokemon.id)
                                    }
                                >
                                    <CardContent className="p-4">
                                        <div
                                            className={`${
                                                viewMode === "list"
                                                    ? "flex items-center gap-4"
                                                    : ""
                                            }`}
                                        >
                                            {/* 宝可梦图片 */}
                                            <div
                                                className={`${
                                                    viewMode === "list"
                                                        ? "w-24 h-24"
                                                        : "w-full h-32"
                                                } bg-gray-100 rounded-lg flex items-center justify-center mb-4 ${
                                                    viewMode === "list"
                                                        ? "mb-0"
                                                        : ""
                                                }`}
                                            >
                                                <img
                                                    src={
                                                        pokemon.sprites
                                                            ?.front_default ||
                                                        "/placeholder.svg?height=120&width=120"
                                                    }
                                                    alt={pokemon.name}
                                                    className="w-full h-full object-contain"
                                                    loading="lazy"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                {/* 宝可梦信息 */}
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-lg">
                                                        #
                                                        {pokemon.id
                                                            .toString()
                                                            .padStart(
                                                                3,
                                                                "0"
                                                            )}{" "}
                                                        {getPokemonChineseName(
                                                            pokemon.name
                                                        )}
                                                    </h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            toggleFavorite.mutate(
                                                                pokemon.id
                                                            )
                                                        }
                                                    >
                                                        <Star
                                                            className={`w-4 h-4 ${
                                                                isFavorite(
                                                                    pokemon.id
                                                                )
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </Button>
                                                </div>

                                                {/* 属性标签 */}
                                                <div className="flex gap-1 mb-3">
                                                    {pokemon.types?.map(
                                                        (typeInfo) => (
                                                            <Badge
                                                                key={
                                                                    typeInfo
                                                                        .type
                                                                        .name
                                                                }
                                                                className={`${
                                                                    TYPE_COLORS[
                                                                        typeInfo
                                                                            .type
                                                                            .name
                                                                    ] ||
                                                                    "bg-gray-400"
                                                                } text-white text-xs`}
                                                            >
                                                                {TYPE_NAMES[
                                                                    typeInfo
                                                                        .type
                                                                        .name
                                                                ] ||
                                                                    typeInfo
                                                                        .type
                                                                        .name}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>

                                                {/* 基础属性 */}
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        HP:{" "}
                                                        {pokemon.stats?.find(
                                                            (s) =>
                                                                s.stat.name ===
                                                                "hp"
                                                        )?.base_stat || "?"}
                                                    </div>
                                                    <div>
                                                        攻击:{" "}
                                                        {pokemon.stats?.find(
                                                            (s) =>
                                                                s.stat.name ===
                                                                "attack"
                                                        )?.base_stat || "?"}
                                                    </div>
                                                    <div>
                                                        防御:{" "}
                                                        {pokemon.stats?.find(
                                                            (s) =>
                                                                s.stat.name ===
                                                                "defense"
                                                        )?.base_stat || "?"}
                                                    </div>
                                                    <div>
                                                        速度:{" "}
                                                        {pokemon.stats?.find(
                                                            (s) =>
                                                                s.stat.name ===
                                                                "speed"
                                                        )?.base_stat || "?"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* 分页 */}
                        {sortedAndPaginatedResults.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((prev) => prev - 1)
                                    }
                                >
                                    上一页
                                </Button>

                                <div className="flex gap-1">
                                    {Array.from(
                                        {
                                            length: Math.min(
                                                5,
                                                sortedAndPaginatedResults.totalPages
                                            ),
                                        },
                                        (_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={
                                                        currentPage === pageNum
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        setCurrentPage(pageNum)
                                                    }
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        }
                                    )}
                                </div>

                                <Button
                                    variant="outline"
                                    disabled={
                                        currentPage ===
                                        sortedAndPaginatedResults.totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                >
                                    下一页
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {/* 无结果提示 */}
                {!isLoading &&
                    currentData.length === 0 &&
                    (searchQuery || selectedType) && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                没有找到匹配的宝可梦
                            </h3>
                            <p className="text-gray-500 mb-4">
                                尝试调整搜索条件或筛选器
                            </p>
                            <Button onClick={resetFilters}>重置筛选条件</Button>
                        </div>
                    )}

                {/* 初始状态 */}
                {!isLoading &&
                    currentData.length === 0 &&
                    !searchQuery &&
                    !selectedType && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                开始搜索宝可梦
                            </h3>
                            <p className="text-gray-500">
                                输入宝可梦名称或选择属性类型来开始搜索
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
}
