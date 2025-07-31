import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    ArrowLeft,
    GitCompare,
    Plus,
    X,
    Search,
    TrendingUp,
    Shield,
    Swords,
    Activity,
    Zap,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { usePokemonDetail, useSearchPokemon } from "@/hooks/usePokemonData";
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

// 能力值中文名映射
const STAT_NAMES: Record<string, string> = {
    hp: "HP",
    attack: "攻击",
    defense: "防御",
    "special-attack": "特攻",
    "special-defense": "特防",
    speed: "速度",
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

interface CompareSlot {
    id: number;
    pokemon: Pokemon | null;
    isLoading: boolean;
    error: string | null;
}

export default function ComparePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // 对比槽位状态
    const [compareSlots, setCompareSlots] = useState<CompareSlot[]>([
        { id: 1, pokemon: null, isLoading: false, error: null },
        { id: 2, pokemon: null, isLoading: false, error: null },
        { id: 3, pokemon: null, isLoading: false, error: null },
        { id: 4, pokemon: null, isLoading: false, error: null },
    ]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // 搜索宝可梦
    const { data: searchResults, isLoading: isSearching } = useSearchPokemon(
        searchQuery,
        20
    );

    // 从URL参数初始化对比列表
    useEffect(() => {
        const pokemonIds = searchParams.get("pokemon")?.split(",") || [];
        pokemonIds.forEach((id: string, index: number) => {
            if (id && index < 4) {
                addPokemonToSlot(index + 1, parseInt(id));
            }
        });
    }, [searchParams]);

    // 更新URL参数
    const updateUrlParams = (slots: CompareSlot[]) => {
        const pokemonIds = slots
            .filter((slot) => slot.pokemon)
            .map((slot) => slot.pokemon!.id)
            .join(",");

        if (pokemonIds) {
            setSearchParams({ pokemon: pokemonIds });
        } else {
            setSearchParams({});
        }
    };

    // 添加宝可梦到对比槽
    const addPokemonToSlot = async (slotId: number, pokemonId: number) => {
        setCompareSlots((prev) =>
            prev.map((slot) =>
                slot.id === slotId
                    ? { ...slot, isLoading: true, error: null }
                    : slot
            )
        );

        try {
            // 这里需要直接调用API获取宝可梦数据
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
            );
            if (!response.ok) throw new Error("获取宝可梦数据失败");
            const pokemon = await response.json();

            setCompareSlots((prev) => {
                const newSlots = prev.map((slot) =>
                    slot.id === slotId
                        ? { ...slot, pokemon, isLoading: false, error: null }
                        : slot
                );
                updateUrlParams(newSlots);
                return newSlots;
            });
        } catch (error) {
            setCompareSlots((prev) =>
                prev.map((slot) =>
                    slot.id === slotId
                        ? {
                              ...slot,
                              isLoading: false,
                              error: "加载失败",
                              pokemon: null,
                          }
                        : slot
                )
            );
        }
    };

    // 移除宝可梦
    const removePokemon = (slotId: number) => {
        setCompareSlots((prev) => {
            const newSlots = prev.map((slot) =>
                slot.id === slotId
                    ? { ...slot, pokemon: null, error: null }
                    : slot
            );
            updateUrlParams(newSlots);
            return newSlots;
        });
    };

    // 清空所有对比
    const clearAll = () => {
        setCompareSlots((prev) =>
            prev.map((slot) => ({ ...slot, pokemon: null, error: null }))
        );
        setSearchParams({});
    };

    // 选择宝可梦
    const selectPokemon = (pokemon: Pokemon) => {
        if (selectedSlotId) {
            addPokemonToSlot(selectedSlotId, pokemon.id);
            setIsDialogOpen(false);
            setSearchQuery("");
            setSelectedSlotId(null);
        }
    };

    // 获取能力值比较结果
    const getStatComparison = (statName: string) => {
        const values = compareSlots
            .filter((slot) => slot.pokemon)
            .map((slot) => {
                const stat = slot.pokemon!.stats?.find(
                    (s) => s.stat.name === statName
                );
                return {
                    slotId: slot.id,
                    value: stat?.base_stat || 0,
                    pokemon: slot.pokemon!,
                };
            });

        const maxValue = Math.max(...values.map((v) => v.value));
        const minValue = Math.min(...values.map((v) => v.value));

        return values.map((v) => ({
            ...v,
            isHighest: v.value === maxValue && maxValue > minValue,
            isLowest: v.value === minValue && maxValue > minValue,
        }));
    };

    const activePokemon = compareSlots.filter((slot) => slot.pokemon);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 面包屑导航 */}
            <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
                <Link to="/" className="hover:text-red-600">
                    首页
                </Link>
                <span>/</span>
                <span className="text-gray-900">宝可梦对比</span>
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
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <GitCompare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            宝可梦对比
                        </h1>
                        <p className="text-gray-600">
                            对比不同宝可梦的属性和能力值
                        </p>
                    </div>
                </div>

                {activePokemon.length > 0 && (
                    <Button
                        variant="outline"
                        onClick={clearAll}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <X className="w-4 h-4 mr-2" />
                        清空对比
                    </Button>
                )}
            </div>

            {/* 对比槽位 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {compareSlots.map((slot) => (
                    <Card
                        key={slot.id}
                        className="relative group hover:shadow-lg transition-all duration-300"
                    >
                        <CardContent className="p-4 text-center min-h-[200px] flex flex-col justify-center">
                            {slot.isLoading ? (
                                <div className="space-y-3">
                                    <Skeleton className="w-16 h-16 mx-auto" />
                                    <Skeleton className="h-4 w-20 mx-auto" />
                                    <Skeleton className="h-3 w-16 mx-auto" />
                                </div>
                            ) : slot.pokemon ? (
                                <>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                                        onClick={() => removePokemon(slot.id)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>

                                    <Link to={`/pokemon/${slot.pokemon.id}`}>
                                        <img
                                            src={
                                                (slot.pokemon.sprites as any)
                                                    ?.other?.[
                                                    "official-artwork"
                                                ]?.front_default ||
                                                slot.pokemon.sprites
                                                    ?.front_default ||
                                                "/placeholder.svg?height=64&width=64"
                                            }
                                            alt={slot.pokemon.name}
                                            className="w-16 h-16 mx-auto mb-3 object-contain hover:scale-110 transition-transform duration-300"
                                        />
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            #
                                            {slot.pokemon.id
                                                .toString()
                                                .padStart(3, "0")}
                                        </h3>
                                        <h4 className="font-medium text-gray-800 mb-2 capitalize">
                                            {POKEMON_CHINESE_NAMES[
                                                slot.pokemon.id
                                            ] || slot.pokemon.name}
                                        </h4>
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {slot.pokemon.types?.map(
                                                (typeInfo) => (
                                                    <Badge
                                                        key={typeInfo.type.name}
                                                        className={`${
                                                            TYPE_COLORS[
                                                                typeInfo.type
                                                                    .name
                                                            ] || "bg-gray-400"
                                                        } text-white text-xs px-2 py-1`}
                                                    >
                                                        {TYPE_NAMES[
                                                            typeInfo.type.name
                                                        ] || typeInfo.type.name}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    </Link>
                                </>
                            ) : (
                                <Dialog
                                    open={
                                        isDialogOpen &&
                                        selectedSlotId === slot.id
                                    }
                                    onOpenChange={(open) => {
                                        setIsDialogOpen(open);
                                        if (!open) {
                                            setSelectedSlotId(null);
                                            setSearchQuery("");
                                        }
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full h-full min-h-[120px] border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                                            onClick={() => {
                                                setSelectedSlotId(slot.id);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <div className="text-center">
                                                <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                <span className="text-gray-600">
                                                    添加宝可梦
                                                </span>
                                            </div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>
                                                选择宝可梦
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="搜索宝可梦名称..."
                                                    className="pl-10"
                                                />
                                            </div>

                                            <div className="max-h-96 overflow-y-auto">
                                                {isSearching ? (
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {Array.from({
                                                            length: 8,
                                                        }).map((_, index) => (
                                                            <div
                                                                key={index}
                                                                className="p-2 text-center"
                                                            >
                                                                <Skeleton className="w-12 h-12 mx-auto mb-2" />
                                                                <Skeleton className="h-3 w-16 mx-auto" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : searchResults &&
                                                  searchResults.length > 0 ? (
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {searchResults.map(
                                                            (pokemon) => (
                                                                <Button
                                                                    key={
                                                                        pokemon.id
                                                                    }
                                                                    variant="ghost"
                                                                    className="p-2 h-auto flex flex-col items-center hover:bg-blue-50"
                                                                    onClick={() =>
                                                                        selectPokemon(
                                                                            pokemon
                                                                        )
                                                                    }
                                                                >
                                                                    <img
                                                                        src={
                                                                            pokemon
                                                                                .sprites
                                                                                ?.front_default ||
                                                                            "/placeholder.svg?height=48&width=48"
                                                                        }
                                                                        alt={
                                                                            pokemon.name
                                                                        }
                                                                        className="w-12 h-12 object-contain mb-1"
                                                                    />
                                                                    <span className="text-xs capitalize">
                                                                        {POKEMON_CHINESE_NAMES[
                                                                            pokemon
                                                                                .id
                                                                        ] ||
                                                                            pokemon.name}
                                                                    </span>
                                                                </Button>
                                                            )
                                                        )}
                                                    </div>
                                                ) : searchQuery ? (
                                                    <div className="text-center py-8 text-gray-500">
                                                        未找到相关宝可梦
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        输入宝可梦名称开始搜索
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}

                            {slot.error && (
                                <Alert className="mt-2 border-red-200 bg-red-50">
                                    <AlertDescription className="text-red-800 text-sm">
                                        {slot.error}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* 对比结果 */}
            {activePokemon.length >= 2 && (
                <div className="space-y-6">
                    {/* 基础信息对比 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Activity className="w-5 h-5 mr-2" />
                                基础信息对比
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 font-medium">
                                                属性
                                            </th>
                                            {activePokemon.map((slot) => (
                                                <th
                                                    key={slot.id}
                                                    className="text-center py-2 font-medium"
                                                >
                                                    {POKEMON_CHINESE_NAMES[
                                                        slot.pokemon!.id
                                                    ] || slot.pokemon!.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="py-2 font-medium">
                                                身高
                                            </td>
                                            {activePokemon.map((slot) => (
                                                <td
                                                    key={slot.id}
                                                    className="text-center py-2"
                                                >
                                                    {(
                                                        slot.pokemon!.height /
                                                        10
                                                    ).toFixed(1)}{" "}
                                                    m
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2 font-medium">
                                                体重
                                            </td>
                                            {activePokemon.map((slot) => (
                                                <td
                                                    key={slot.id}
                                                    className="text-center py-2"
                                                >
                                                    {(
                                                        slot.pokemon!.weight /
                                                        10
                                                    ).toFixed(1)}{" "}
                                                    kg
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2 font-medium">
                                                基础经验值
                                            </td>
                                            {activePokemon.map((slot) => (
                                                <td
                                                    key={slot.id}
                                                    className="text-center py-2"
                                                >
                                                    {slot.pokemon!
                                                        .base_experience ||
                                                        "未知"}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 能力值对比 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                能力值对比
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    "hp",
                                    "attack",
                                    "defense",
                                    "special-attack",
                                    "special-defense",
                                    "speed",
                                ].map((statName) => {
                                    const comparison =
                                        getStatComparison(statName);
                                    return (
                                        <div key={statName}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">
                                                    {STAT_NAMES[statName] ||
                                                        statName}
                                                </span>
                                                <div className="flex items-center space-x-4">
                                                    {comparison.map((comp) => (
                                                        <div
                                                            key={comp.slotId}
                                                            className={`text-sm font-mono px-2 py-1 rounded ${
                                                                comp.isHighest
                                                                    ? "bg-green-100 text-green-800"
                                                                    : comp.isLowest
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {comp.value}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {comparison.map((comp) => (
                                                    <div
                                                        key={comp.slotId}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <div className="w-20 text-xs truncate">
                                                            {POKEMON_CHINESE_NAMES[
                                                                comp.pokemon.id
                                                            ] ||
                                                                comp.pokemon
                                                                    .name}
                                                        </div>
                                                        <div className="flex-1">
                                                            <Progress
                                                                value={
                                                                    (comp.value /
                                                                        200) *
                                                                    100
                                                                }
                                                                className={`h-2 ${
                                                                    comp.isHighest
                                                                        ? "[&>div]:bg-green-500"
                                                                        : comp.isLowest
                                                                        ? "[&>div]:bg-red-500"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* 总和对比 */}
                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">
                                            种族值总和
                                        </span>
                                        <div className="flex items-center space-x-4">
                                            {activePokemon.map((slot) => {
                                                const total =
                                                    slot.pokemon!.stats?.reduce(
                                                        (sum, stat) =>
                                                            sum +
                                                            stat.base_stat,
                                                        0
                                                    ) || 0;
                                                const maxTotal = Math.max(
                                                    ...activePokemon.map(
                                                        (s) =>
                                                            s.pokemon!.stats?.reduce(
                                                                (sum, stat) =>
                                                                    sum +
                                                                    stat.base_stat,
                                                                0
                                                            ) || 0
                                                    )
                                                );
                                                return (
                                                    <div
                                                        key={slot.id}
                                                        className={`text-lg font-bold px-3 py-1 rounded ${
                                                            total === maxTotal
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "text-gray-800"
                                                        }`}
                                                    >
                                                        {total}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 空状态提示 */}
            {activePokemon.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <GitCompare className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        开始对比宝可梦
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        点击上方的"添加宝可梦"按钮，选择你想要对比的宝可梦。至少需要添加2只宝可梦才能开始对比。
                    </p>
                    <Link to="/search">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Search className="w-4 h-4 mr-2" />
                            去搜索宝可梦
                        </Button>
                    </Link>
                </div>
            )}

            {activePokemon.length === 1 && (
                <div className="text-center py-8">
                    <Alert className="max-w-md mx-auto">
                        <AlertDescription>
                            再添加至少一只宝可梦开始对比吧！
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}
