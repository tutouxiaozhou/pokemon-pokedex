import React, { useState } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTeamStore } from "../stores/teamStore";
import { Pokemon, pokemonApi } from "../services/pokemonApi";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import {
    Plus,
    X,
    Save,
    Share2,
    RotateCcw,
    Search,
    Shield,
    Sword,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";

// 队伍槽位组件
interface TeamSlotProps {
    position: number;
    pokemon: any;
    onRemove: () => void;
    onSearch: () => void;
}

function TeamSlot({ position, pokemon, onRemove, onSearch }: TeamSlotProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: position });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (!pokemon) {
        return (
            <Card
                ref={setNodeRef}
                style={style}
                className={cn(
                    "h-48 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer",
                    isDragging && "opacity-50"
                )}
                onClick={onSearch}
            >
                <CardContent className="flex flex-col items-center justify-center h-full p-4">
                    <Plus className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                        点击添加宝可梦
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            normal: "bg-gray-400",
            fire: "bg-red-500",
            water: "bg-blue-500",
            electric: "bg-yellow-500",
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
        return colors[type] || "bg-gray-400";
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                "h-48 relative group hover:shadow-lg transition-shadow cursor-move",
                isDragging && "opacity-50"
            )}
            {...attributes}
            {...listeners}
        >
            <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
            >
                <X className="w-4 h-4" />
            </Button>

            <CardContent className="p-4 h-full flex flex-col">
                <div className="flex-1 flex flex-col items-center">
                    <img
                        src={pokemon.pokemon.sprites.front_default}
                        alt={pokemon.pokemon.name}
                        className="w-16 h-16 mb-2"
                    />
                    <h3 className="font-semibold text-sm text-center mb-1">
                        {pokemon.nickname || pokemon.pokemon.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                        Lv.{pokemon.level}
                    </p>
                    <div className="flex gap-1 flex-wrap justify-center">
                        {pokemon.pokemon.types.map((type: any) => (
                            <Badge
                                key={type.type.name}
                                className={cn(
                                    "text-white text-xs px-2 py-1",
                                    getTypeColor(type.type.name)
                                )}
                            >
                                {type.type.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// 宝可梦搜索对话框
interface PokemonSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (pokemon: Pokemon) => void;
}

function PokemonSearchDialog({
    open,
    onOpenChange,
    onSelect,
}: PokemonSearchDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [popularPokemon, setPopularPokemon] = useState<Pokemon[]>([]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const results = await pokemonApi.searchPokemon(searchQuery, 20);
            setSearchResults(results);
        } catch (error) {
            console.error("搜索失败:", error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 加载热门宝可梦
    React.useEffect(() => {
        const loadPopularPokemon = async () => {
            try {
                // 加载一些热门宝可梦
                const popularIds = [25, 6, 9, 3, 150, 144, 145, 146]; // 皮卡丘、喷火龙、水箭龟等
                const popular = await pokemonApi.getBatchPokemon(popularIds);
                setPopularPokemon(popular);
            } catch (error) {
                console.error("加载热门宝可梦失败:", error);
            }
        };

        if (open) {
            loadPopularPokemon();
        }
    }, [open]);

    // 自动搜索功能
    React.useEffect(() => {
        if (searchQuery.trim() && searchQuery.length >= 2) {
            const timeoutId = setTimeout(() => {
                handleSearch();
            }, 500);
            return () => clearTimeout(timeoutId);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>搜索宝可梦</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="输入宝可梦名称或编号..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                        />
                        <Button onClick={handleSearch} disabled={isLoading}>
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>

                    <ScrollArea className="h-96">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="text-sm text-gray-500">
                                        搜索中...
                                    </p>
                                </div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {searchResults.map((pokemon) => (
                                    <Card
                                        key={pokemon.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => {
                                            onSelect(pokemon);
                                            onOpenChange(false);
                                        }}
                                    >
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <img
                                                src={
                                                    pokemon.sprites
                                                        .front_default
                                                }
                                                alt={pokemon.name}
                                                className="w-12 h-12"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).src =
                                                        "https://placehold.co/48x48/e5e7eb/6b7280?text=?";
                                                }}
                                            />
                                            <div>
                                                <h4 className="font-semibold">
                                                    {pokemon.name}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    #{pokemon.id}
                                                </p>
                                                <div className="flex gap-1 mt-1">
                                                    {pokemon.types
                                                        .slice(0, 2)
                                                        .map((type: any) => (
                                                            <Badge
                                                                key={
                                                                    type.type
                                                                        .name
                                                                }
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {type.type.name}
                                                            </Badge>
                                                        ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : searchQuery.trim() ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-2">
                                        未找到匹配的宝可梦
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        尝试使用中文名称、英文名称或编号搜索
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 mb-1">
                                        开始搜索宝可梦
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        输入至少2个字符开始搜索
                                    </p>
                                </div>

                                {popularPokemon.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                                            热门推荐
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {popularPokemon
                                                .slice(0, 6)
                                                .map((pokemon) => (
                                                    <Card
                                                        key={pokemon.id}
                                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                                        onClick={() => {
                                                            onSelect(pokemon);
                                                            onOpenChange(false);
                                                        }}
                                                    >
                                                        <CardContent className="p-3 flex items-center gap-2">
                                                            <img
                                                                src={
                                                                    pokemon
                                                                        .sprites
                                                                        .front_default
                                                                }
                                                                alt={
                                                                    pokemon.name
                                                                }
                                                                className="w-10 h-10"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    (
                                                                        e.target as HTMLImageElement
                                                                    ).src =
                                                                        "https://placehold.co/40x40/e5e7eb/6b7280?text=?";
                                                                }}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-medium text-sm truncate">
                                                                    {
                                                                        pokemon.name
                                                                    }
                                                                </h5>
                                                                <p className="text-xs text-gray-500">
                                                                    #
                                                                    {pokemon.id}
                                                                </p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 队伍分析面板
function TeamAnalysisPanel() {
    const { teamAnalysis } = useTeamStore();

    if (!teamAnalysis) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        队伍分析
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 text-center py-8">
                        添加宝可梦后将显示队伍分析
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    队伍分析
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs defaultValue="weaknesses" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="weaknesses">弱点</TabsTrigger>
                        <TabsTrigger value="resistances">抗性</TabsTrigger>
                        <TabsTrigger value="coverage">覆盖</TabsTrigger>
                        <TabsTrigger value="suggestions">建议</TabsTrigger>
                    </TabsList>

                    <TabsContent value="weaknesses" className="space-y-2">
                        {teamAnalysis.weaknesses.length > 0 ? (
                            teamAnalysis.weaknesses.map((weakness) => (
                                <div
                                    key={weakness.type}
                                    className="flex items-center justify-between"
                                >
                                    <Badge variant="destructive">
                                        {weakness.type}
                                    </Badge>
                                    <span className="text-sm">
                                        {weakness.effectiveness}x
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                暂无明显弱点
                            </p>
                        )}
                    </TabsContent>

                    <TabsContent value="resistances" className="space-y-2">
                        {teamAnalysis.resistances.length > 0 ? (
                            teamAnalysis.resistances.map((resistance) => (
                                <div
                                    key={resistance.type}
                                    className="flex items-center justify-between"
                                >
                                    <Badge variant="secondary">
                                        {resistance.type}
                                    </Badge>
                                    <span className="text-sm">
                                        {resistance.effectiveness}x
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                暂无抗性
                            </p>
                        )}
                    </TabsContent>

                    <TabsContent value="coverage" className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {teamAnalysis.coverage.map((type) => (
                                <Badge key={type} variant="outline">
                                    {type}
                                </Badge>
                            ))}
                        </div>
                        {teamAnalysis.coverage.length === 0 && (
                            <p className="text-gray-500 text-center py-4">
                                攻击覆盖面有限
                            </p>
                        )}
                    </TabsContent>

                    <TabsContent value="suggestions" className="space-y-2">
                        {teamAnalysis.suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{suggestion}</p>
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default function TeamBuilderPage() {
    const {
        currentTeam,
        addPokemonToTeam,
        removePokemonFromTeam,
        movePokemon,
        saveCurrentTeam,
        shareTeam,
        resetTeam,
        analyzeTeam,
    } = useTeamStore();

    const { toast } = useToast();
    const [activeId, setActiveId] = useState<number | null>(null);
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<number>(0);
    const [teamName, setTeamName] = useState(currentTeam.name);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            movePokemon(active.id as number, over.id as number);
        }

        setActiveId(null);
    };

    const handleAddPokemon = (position: number) => {
        setSelectedPosition(position);
        setSearchDialogOpen(true);
    };

    const handleSelectPokemon = (pokemon: Pokemon) => {
        // 检查是否已经存在相同的宝可梦
        const isDuplicate = currentTeam.pokemon.some(
            (p) => p !== null && p.pokemon.id === pokemon.id
        );

        if (isDuplicate) {
            toast({
                title: "添加失败",
                description: "该宝可梦已在队伍中，不能重复添加！",
                variant: "destructive",
            });
            return;
        }

        addPokemonToTeam(pokemon, selectedPosition);
        toast({
            title: "添加成功",
            description: `${pokemon.name} 已添加到队伍中`,
        });
    };

    const handleSaveTeam = () => {
        if (!teamName.trim()) {
            toast({
                title: "保存失败",
                description: "请输入队伍名称！",
                variant: "destructive",
            });
            return;
        }

        const success = saveCurrentTeam(teamName);
        if (success) {
            toast({
                title: "保存成功",
                description: "队伍已保存到本地",
            });
        } else {
            toast({
                title: "保存失败",
                description: "保存过程中出现错误，请重试！",
                variant: "destructive",
            });
        }
    };

    const handleShareTeam = () => {
        const shareUrl = shareTeam();

        if (shareUrl) {
            // 尝试复制到剪贴板
            if (navigator.clipboard) {
                navigator.clipboard
                    .writeText(shareUrl)
                    .then(() => {
                        toast({
                            title: "分享成功",
                            description: "分享链接已复制到剪贴板！",
                        });
                    })
                    .catch(() => {
                        // 如果复制失败，显示链接
                        toast({
                            title: "分享链接",
                            description: "复制失败，请手动复制链接",
                        });
                        prompt("分享链接（请手动复制）:", shareUrl);
                    });
            } else {
                toast({
                    title: "分享链接",
                    description: "请手动复制分享链接",
                });
                prompt("分享链接（请手动复制）:", shareUrl);
            }
        } else {
            toast({
                title: "分享失败",
                description: "请先添加宝可梦到队伍中！",
                variant: "destructive",
            });
        }
    };

    const pokemonCount = currentTeam.pokemon.filter((p) => p !== null).length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">队伍构建器</h1>
                        <p className="text-gray-600">
                            构建你的完美宝可梦队伍，分析属性克制关系
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleShareTeam}>
                            <Share2 className="w-4 h-4 mr-2" />
                            分享
                        </Button>
                        <Button variant="outline" onClick={resetTeam}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            重置
                        </Button>
                        <Button onClick={handleSaveTeam}>
                            <Save className="w-4 h-4 mr-2" />
                            保存队伍
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <Input
                        placeholder="队伍名称"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="max-w-xs"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            队伍完成度:
                        </span>
                        <Progress
                            value={(pokemonCount / 6) * 100}
                            className="w-24"
                        />
                        <span className="text-sm font-medium">
                            {pokemonCount}/6
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 队伍展示区域 */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>我的队伍</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DndContext
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={[0, 1, 2, 3, 4, 5]}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {currentTeam.pokemon.map(
                                            (pokemon, index) => (
                                                <TeamSlot
                                                    key={index}
                                                    position={index}
                                                    pokemon={pokemon}
                                                    onRemove={() =>
                                                        removePokemonFromTeam(
                                                            index
                                                        )
                                                    }
                                                    onSearch={() =>
                                                        handleAddPokemon(index)
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {activeId !== null &&
                                        currentTeam.pokemon[activeId] && (
                                            <TeamSlot
                                                position={activeId}
                                                pokemon={
                                                    currentTeam.pokemon[
                                                        activeId
                                                    ]
                                                }
                                                onRemove={() => {}}
                                                onSearch={() => {}}
                                            />
                                        )}
                                </DragOverlay>
                            </DndContext>
                        </CardContent>
                    </Card>
                </div>

                {/* 队伍分析面板 */}
                <div className="space-y-6">
                    <TeamAnalysisPanel />
                </div>
            </div>

            {/* 宝可梦搜索对话框 */}
            <PokemonSearchDialog
                open={searchDialogOpen}
                onOpenChange={setSearchDialogOpen}
                onSelect={handleSelectPokemon}
            />

            {/* Toast 通知组件 */}
            <Toaster />
        </div>
    );
}
