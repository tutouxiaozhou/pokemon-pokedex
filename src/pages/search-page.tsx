import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
    Search,
    Filter,
    Grid,
    List,
    Heart,
    GitCompare,
    Star,
    X,
    SortAsc,
    SortDesc,
    Clock,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// 扩展的宝可梦数据
const mockPokemon = [
    {
        id: 1,
        name: "妙蛙种子",
        nameEn: "Bulbasaur",
        type: ["草", "毒"],
        generation: 1,
        hp: 45,
        attack: 49,
        defense: 49,
        speed: 45,
        height: 0.7,
        weight: 6.9,
        image: "/placeholder.svg?height=120&width=120",
        rarity: "common",
        isLegendary: false,
    },
    {
        id: 4,
        name: "小火龙",
        nameEn: "Charmander",
        type: ["火"],
        generation: 1,
        hp: 39,
        attack: 52,
        defense: 43,
        speed: 65,
        height: 0.6,
        weight: 8.5,
        image: "/placeholder.svg?height=120&width=120",
        rarity: "common",
        isLegendary: false,
    },
    {
        id: 7,
        name: "杰尼龟",
        nameEn: "Squirtle",
        type: ["水"],
        generation: 1,
        hp: 44,
        attack: 48,
        defense: 65,
        speed: 43,
        height: 0.5,
        weight: 9.0,
        image: "/placeholder.svg?height=120&width=120",
        rarity: "common",
        isLegendary: false,
    },
    {
        id: 25,
        name: "皮卡丘",
        nameEn: "Pikachu",
        type: ["电"],
        generation: 1,
        hp: 35,
        attack: 55,
        defense: 40,
        speed: 90,
        height: 0.4,
        weight: 6.0,
        image: "/placeholder.svg?height=120&width=120",
        rarity: "rare",
        isLegendary: false,
    },
    {
        id: 150,
        name: "超梦",
        nameEn: "Mewtwo",
        type: ["超能力"],
        generation: 1,
        hp: 106,
        attack: 110,
        defense: 90,
        speed: 130,
        height: 2.0,
        weight: 122.0,
        image: "/placeholder.svg?height=120&width=120",
        rarity: "legendary",
        isLegendary: true,
    },
    {
        id: 151,
        name: "梦幻",
        nameEn: "Mew",
        type: ["超能力"],
        generation: 1,
        hp: 100,
        attack: 100,
        defense: 100,
        speed: 100,
        height: 0.4,
        weight: 4.0,
        image: "/placeholder.svg?height=120&width=120",
        rarity: "mythical",
        isLegendary: true,
    },
    {
        id: 152,
        name: "菊草叶",
        nameEn: "Chikorita",
        type: ["草"],
        generation: 2,
        hp: 45,
        attack: 49,
        defense: 65,
        speed: 45,
        height: 0.9,
        weight: 6.4,
        image: "/placeholder.svg?height=120&width=120",
        rarity: "common",
        isLegendary: false,
    },
    {
        id: 155,
        name: "火球鼠",
        nameEn: "Cyndaquil",
        type: ["火"],
        generation: 2,
        hp: 39,
        attack: 52,
        defense: 43,
        speed: 65,
        height: 0.5,
        weight: 7.9,
        image: "/placeholder.svg?height=120&width=120",
        rarity: "common",
        isLegendary: false,
    },
    {
        id: 158,
        name: "小锯鳄",
        nameEn: "Totodile",
        type: ["水"],
        generation: 2,
        hp: 50,
        attack: 65,
        defense: 64,
        speed: 43,
        height: 0.6,
        weight: 9.5,
        image: "/placeholder.svg?height=120&width=120",
        rarity: "common",
        isLegendary: false,
    },
    {
        id: 144,
        name: "急冻鸟",
        nameEn: "Articuno",
        type: ["冰", "飞行"],
        generation: 1,
        hp: 90,
        attack: 85,
        defense: 100,
        speed: 85,
        height: 1.7,
        weight: 55.4,
        image: "/placeholder.svg?height=120&width=120",
        rarity: "legendary",
        isLegendary: true,
    },
];

const typeColors: Record<string, string> = {
    草: "bg-green-500",
    火: "bg-red-500",
    水: "bg-blue-500",
    电: "bg-yellow-500",
    超能力: "bg-purple-500",
    毒: "bg-purple-600",
    冰: "bg-cyan-400",
    飞行: "bg-indigo-400",
};

const pokemonTypes = [
    "草",
    "火",
    "水",
    "电",
    "超能力",
    "毒",
    "飞行",
    "虫",
    "一般",
    "格斗",
    "地面",
    "岩石",
    "钢",
    "冰",
    "幽灵",
    "龙",
    "恶",
    "妖精",
];

// 搜索历史和热门搜索
const searchHistory = ["皮卡丘", "超梦", "小火龙"];
const hotSearches = ["传说宝可梦", "第一世代", "火属性", "高攻击力"];

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedGeneration, setSelectedGeneration] = useState<string>("");
    const [hpRange, setHpRange] = useState([0, 150]);
    const [attackRange, setAttackRange] = useState([0, 150]);
    const [sortBy, setSortBy] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [showLegendaryOnly, setShowLegendaryOnly] = useState(false);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // 搜索建议
    const searchSuggestions = useMemo(() => {
        if (!searchQuery) return [];
        return mockPokemon
            .filter(
                (pokemon) =>
                    pokemon.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    pokemon.nameEn
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            )
            .slice(0, 5);
    }, [searchQuery]);

    // 过滤和排序逻辑
    const filteredAndSortedPokemon = useMemo(() => {
        let filtered = mockPokemon;

        // 按搜索词过滤
        if (searchQuery) {
            filtered = filtered.filter(
                (pokemon) =>
                    pokemon.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    pokemon.nameEn
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    pokemon.id.toString().includes(searchQuery)
            );
        }

        // 按属性过滤
        if (selectedTypes.length > 0) {
            filtered = filtered.filter((pokemon) =>
                pokemon.type.some((type) => selectedTypes.includes(type))
            );
        }

        // 按世代过滤
        if (selectedGeneration) {
            filtered = filtered.filter(
                (pokemon) => pokemon.generation === parseInt(selectedGeneration)
            );
        }

        // 按HP范围过滤
        filtered = filtered.filter(
            (pokemon) => pokemon.hp >= hpRange[0] && pokemon.hp <= hpRange[1]
        );

        // 按攻击力范围过滤
        filtered = filtered.filter(
            (pokemon) =>
                pokemon.attack >= attackRange[0] &&
                pokemon.attack <= attackRange[1]
        );

        // 传说宝可梦筛选
        if (showLegendaryOnly) {
            filtered = filtered.filter((pokemon) => pokemon.isLegendary);
        }

        // 排序
        filtered.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case "name":
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case "hp":
                    aValue = a.hp;
                    bValue = b.hp;
                    break;
                case "attack":
                    aValue = a.attack;
                    bValue = b.attack;
                    break;
                case "speed":
                    aValue = a.speed;
                    bValue = b.speed;
                    break;
                default:
                    aValue = a.id;
                    bValue = b.id;
            }

            if (typeof aValue === "string") {
                return sortOrder === "asc"
                    ? aValue.localeCompare(bValue as string)
                    : (bValue as string).localeCompare(aValue);
            } else {
                return sortOrder === "asc"
                    ? (aValue as number) - (bValue as number)
                    : (bValue as number) - (aValue as number);
            }
        });

        return filtered;
    }, [
        searchQuery,
        selectedTypes,
        selectedGeneration,
        hpRange,
        attackRange,
        sortBy,
        sortOrder,
        showLegendaryOnly,
    ]);

    // 分页逻辑
    const totalPages = Math.ceil(
        filteredAndSortedPokemon.length / itemsPerPage
    );
    const paginatedPokemon = filteredAndSortedPokemon.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleTypeChange = (type: string, checked: boolean) => {
        if (checked) {
            setSelectedTypes([...selectedTypes, type]);
        } else {
            setSelectedTypes(selectedTypes.filter((t) => t !== type));
        }
        setCurrentPage(1);
    };

    const handleSearchSubmit = (query: string) => {
        setSearchQuery(query);
        setShowSearchSuggestions(false);
        setCurrentPage(1);
        // 更新URL参数
        if (query) {
            setSearchParams({ q: query });
        } else {
            setSearchParams({});
        }
    };

    const resetFilters = () => {
        setSelectedTypes([]);
        setSelectedGeneration("");
        setHpRange([0, 150]);
        setAttackRange([0, 150]);
        setShowLegendaryOnly(false);
        setSortBy("id");
        setSortOrder("asc");
        setSearchQuery("");
        setCurrentPage(1);
        setSearchParams({});
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 搜索栏 */}
            <div className="mb-8">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchSuggestions(true);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleSearchSubmit(searchQuery);
                            }
                        }}
                        onFocus={() => setShowSearchSuggestions(true)}
                        placeholder="搜索宝可梦名称、编号..."
                        className="pl-12 pr-4 py-3 text-lg rounded-full border-2 border-gray-200 focus:border-red-500"
                    />

                    {/* 搜索建议下拉框 */}
                    {showSearchSuggestions &&
                        (searchSuggestions.length > 0 ||
                            searchQuery === "") && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                                {searchQuery === "" && (
                                    <>
                                        <div className="p-3 border-b">
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <Clock className="w-4 h-4 mr-2" />
                                                搜索历史
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {searchHistory.map((term) => (
                                                    <Badge
                                                        key={term}
                                                        variant="secondary"
                                                        className="cursor-pointer hover:bg-gray-200"
                                                        onClick={() =>
                                                            handleSearchSubmit(
                                                                term
                                                            )
                                                        }
                                                    >
                                                        {term}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <TrendingUp className="w-4 h-4 mr-2" />
                                                热门搜索
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {hotSearches.map((term) => (
                                                    <Badge
                                                        key={term}
                                                        variant="outline"
                                                        className="cursor-pointer hover:bg-red-50"
                                                        onClick={() =>
                                                            handleSearchSubmit(
                                                                term
                                                            )
                                                        }
                                                    >
                                                        {term}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {searchSuggestions.length > 0 && (
                                    <div className="p-2">
                                        {searchSuggestions.map((pokemon) => (
                                            <div
                                                key={pokemon.id}
                                                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                onClick={() =>
                                                    handleSearchSubmit(
                                                        pokemon.name
                                                    )
                                                }
                                            >
                                                <img
                                                    src={pokemon.image}
                                                    alt={pokemon.name}
                                                    className="w-8 h-8 mr-3"
                                                />
                                                <div>
                                                    <div className="font-medium">
                                                        {pokemon.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        #
                                                        {pokemon.id
                                                            .toString()
                                                            .padStart(3, "0")}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </div>

            <div className="flex gap-8">
                {/* 左侧筛选面板 */}
                <div className="w-80 space-y-6">
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center">
                                    <Filter className="w-5 h-5 mr-2" />
                                    筛选条件
                                </h3>
                                {(selectedTypes.length > 0 ||
                                    selectedGeneration ||
                                    showLegendaryOnly) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={resetFilters}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        清除
                                    </Button>
                                )}
                            </div>

                            {/* 传说宝可梦筛选 */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="legendary"
                                        checked={showLegendaryOnly}
                                        onCheckedChange={setShowLegendaryOnly}
                                    />
                                    <label
                                        htmlFor="legendary"
                                        className="text-sm cursor-pointer flex items-center"
                                    >
                                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                        仅显示传说宝可梦
                                    </label>
                                </div>
                            </div>

                            {/* 属性筛选 */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">属性类型</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {pokemonTypes.slice(0, 10).map((type) => (
                                        <div
                                            key={type}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={type}
                                                checked={selectedTypes.includes(
                                                    type
                                                )}
                                                onCheckedChange={(checked) =>
                                                    handleTypeChange(
                                                        type,
                                                        checked as boolean
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor={type}
                                                className="text-sm cursor-pointer"
                                            >
                                                {type}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 世代筛选 */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">世代</h4>
                                <Select
                                    value={selectedGeneration}
                                    onValueChange={setSelectedGeneration}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择世代" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">
                                            全部世代
                                        </SelectItem>
                                        <SelectItem value="1">
                                            第一世代
                                        </SelectItem>
                                        <SelectItem value="2">
                                            第二世代
                                        </SelectItem>
                                        <SelectItem value="3">
                                            第三世代
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* HP范围筛选 */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">
                                    HP范围: {hpRange[0]} - {hpRange[1]}
                                </h4>
                                <Slider
                                    value={hpRange}
                                    onValueChange={setHpRange}
                                    max={150}
                                    min={0}
                                    step={5}
                                    className="w-full"
                                />
                            </div>

                            {/* 攻击力范围筛选 */}
                            <div className="mb-6">
                                <h4 className="font-medium mb-3">
                                    攻击力范围: {attackRange[0]} -{" "}
                                    {attackRange[1]}
                                </h4>
                                <Slider
                                    value={attackRange}
                                    onValueChange={setAttackRange}
                                    max={150}
                                    min={0}
                                    step={5}
                                    className="w-full"
                                />
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={resetFilters}
                            >
                                重置所有筛选
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* 右侧搜索结果 */}
                <div className="flex-1">
                    {/* 结果工具栏 */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-gray-600">
                            找到 {filteredAndSortedPokemon.length} 个结果
                            {currentPage > 1 && ` (第 ${currentPage} 页)`}
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* 排序选择 */}
                            <div className="flex items-center space-x-2">
                                <Select
                                    value={sortBy}
                                    onValueChange={setSortBy}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="id">编号</SelectItem>
                                        <SelectItem value="name">
                                            名称
                                        </SelectItem>
                                        <SelectItem value="hp">HP</SelectItem>
                                        <SelectItem value="attack">
                                            攻击力
                                        </SelectItem>
                                        <SelectItem value="speed">
                                            速度
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
                                    {sortOrder === "asc" ? (
                                        <SortAsc className="w-4 h-4" />
                                    ) : (
                                        <SortDesc className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>

                            {/* 视图模式切换 */}
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={
                                        viewMode === "grid"
                                            ? "default"
                                            : "outline"
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
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* 搜索结果网格 */}
                    {paginatedPokemon.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg mb-4">
                                没有找到匹配的宝可梦
                            </div>
                            <Button variant="outline" onClick={resetFilters}>
                                清除筛选条件
                            </Button>
                        </div>
                    ) : (
                        <div
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                    : "space-y-4"
                            }
                        >
                            {paginatedPokemon.map((pokemon) => (
                                <Link
                                    key={pokemon.id}
                                    to={`/pokemon/${pokemon.id}`}
                                >
                                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                        <CardContent
                                            className={
                                                viewMode === "grid"
                                                    ? "p-4 text-center"
                                                    : "p-4 flex items-center space-x-4"
                                            }
                                        >
                                            <div className="relative">
                                                <img
                                                    src={pokemon.image}
                                                    alt={pokemon.name}
                                                    className={
                                                        viewMode === "grid"
                                                            ? "w-20 h-20 mx-auto object-contain mb-3 group-hover:scale-110 transition-transform duration-300"
                                                            : "w-16 h-16 object-contain"
                                                    }
                                                />
                                                <div className="absolute -top-1 -right-1">
                                                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                                                </div>
                                                {pokemon.isLegendary && (
                                                    <div className="absolute -top-1 -left-1">
                                                        <Star className="w-4 h-4 text-yellow-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className={
                                                    viewMode === "grid"
                                                        ? ""
                                                        : "flex-1"
                                                }
                                            >
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    #
                                                    {pokemon.id
                                                        .toString()
                                                        .padStart(3, "0")}
                                                </h3>
                                                <h4 className="font-medium text-gray-800 mb-2">
                                                    {pokemon.name}
                                                </h4>
                                                <div className="flex flex-wrap gap-1 justify-center">
                                                    {pokemon.type.map(
                                                        (type) => (
                                                            <Badge
                                                                key={type}
                                                                className={`${typeColors[type]} text-white text-xs px-2 py-1`}
                                                            >
                                                                {type}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                                {viewMode === "list" && (
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        HP: {pokemon.hp} | 攻击:{" "}
                                                        {pokemon.attack} | 防御:{" "}
                                                        {pokemon.defense} |
                                                        速度: {pokemon.speed}
                                                    </div>
                                                )}
                                            </div>
                                            {viewMode === "list" && (
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <GitCompare className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* 分页 */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                >
                                    上一页
                                </Button>
                                {Array.from(
                                    { length: Math.min(5, totalPages) },
                                    (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Button
                                                key={page}
                                                variant={
                                                    currentPage === page
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                            >
                                                {page}
                                            </Button>
                                        );
                                    }
                                )}
                                {totalPages > 5 && (
                                    <span className="px-2 py-2">...</span>
                                )}
                                {totalPages > 5 && (
                                    <Button
                                        variant={
                                            currentPage === totalPages
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            setCurrentPage(totalPages)
                                        }
                                    >
                                        {totalPages}
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                >
                                    下一页
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
