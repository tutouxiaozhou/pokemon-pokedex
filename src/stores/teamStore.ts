import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pokemon } from "../services/pokemonApi";

// 队伍中的宝可梦接口
export interface TeamPokemon {
    id: number;
    pokemon: Pokemon;
    nickname?: string;
    level: number;
    position: number; // 队伍中的位置 (0-5)
}

// 队伍接口
export interface Team {
    id: string;
    name: string;
    description?: string;
    pokemon: (TeamPokemon | null)[]; // 6个位置，可以为空
    createdAt: Date;
    updatedAt: Date;
}

// 属性克制关系
export interface TypeEffectiveness {
    type: string;
    effectiveness: number; // 0.25, 0.5, 1, 2, 4
}

// 队伍分析结果
export interface TeamAnalysis {
    weaknesses: TypeEffectiveness[];
    resistances: TypeEffectiveness[];
    immunities: string[];
    coverage: string[]; // 队伍能够有效攻击的属性
    suggestions: string[]; // 改进建议
}

interface TeamState {
    // 当前队伍
    currentTeam: Team;

    // 所有保存的队伍
    savedTeams: Team[];

    // 队伍分析结果
    teamAnalysis: TeamAnalysis | null;

    // 操作方法
    addPokemonToTeam: (pokemon: Pokemon, position: number) => void;
    removePokemonFromTeam: (position: number) => void;
    movePokemon: (fromPosition: number, toPosition: number) => void;
    updatePokemonNickname: (position: number, nickname: string) => void;
    updatePokemonLevel: (position: number, level: number) => void;

    // 队伍管理
    saveCurrentTeam: (name: string, description?: string) => boolean;
    loadTeam: (teamId: string) => void;
    deleteTeam: (teamId: string) => void;
    createNewTeam: (name?: string) => void;

    // 分享功能
    shareTeam: (teamId?: string) => string | null;
    importTeam: (shareData: any) => boolean;

    // 工具方法
    isPokemonInTeam: (pokemonId: number) => boolean;

    // 队伍分析
    analyzeTeam: () => void;

    // 重置
    resetTeam: () => void;
}

// 属性克制关系表
const TYPE_CHART: Record<string, Record<string, number>> = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: {
        fire: 0.5,
        water: 0.5,
        grass: 2,
        ice: 2,
        bug: 2,
        rock: 0.5,
        dragon: 0.5,
        steel: 2,
    },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: {
        water: 2,
        electric: 0.5,
        grass: 0.5,
        ground: 0,
        flying: 2,
        dragon: 0.5,
    },
    grass: {
        fire: 0.5,
        water: 2,
        grass: 0.5,
        poison: 0.5,
        flying: 0.5,
        bug: 0.5,
        rock: 2,
        ground: 2,
        dragon: 0.5,
        steel: 0.5,
    },
    ice: {
        fire: 0.5,
        water: 0.5,
        grass: 2,
        ice: 0.5,
        ground: 2,
        flying: 2,
        dragon: 2,
        steel: 0.5,
    },
    fighting: {
        normal: 2,
        ice: 2,
        poison: 0.5,
        flying: 0.5,
        psychic: 0.5,
        bug: 0.5,
        rock: 2,
        ghost: 0,
        dark: 2,
        steel: 2,
        fairy: 0.5,
    },
    poison: {
        grass: 2,
        poison: 0.5,
        ground: 0.5,
        rock: 0.5,
        ghost: 0.5,
        steel: 0,
        fairy: 2,
    },
    ground: {
        fire: 2,
        electric: 2,
        grass: 0.5,
        poison: 2,
        flying: 0,
        bug: 0.5,
        rock: 2,
        steel: 2,
    },
    flying: {
        electric: 0.5,
        grass: 2,
        ice: 0.5,
        fighting: 2,
        bug: 2,
        rock: 0.5,
        steel: 0.5,
    },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: {
        fire: 0.5,
        grass: 2,
        fighting: 0.5,
        poison: 0.5,
        flying: 0.5,
        psychic: 2,
        ghost: 0.5,
        dark: 2,
        steel: 0.5,
        fairy: 0.5,
    },
    rock: {
        fire: 2,
        ice: 2,
        fighting: 0.5,
        ground: 0.5,
        flying: 2,
        bug: 2,
        steel: 0.5,
    },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: {
        fire: 0.5,
        water: 0.5,
        electric: 0.5,
        ice: 2,
        rock: 2,
        steel: 0.5,
        fairy: 2,
    },
    fairy: {
        fire: 0.5,
        fighting: 2,
        poison: 0.5,
        dragon: 2,
        dark: 2,
        steel: 0.5,
    },
};

// 创建默认队伍
const createDefaultTeam = (): Team => ({
    id: `team_${Date.now()}`,
    name: "新队伍",
    pokemon: Array(6).fill(null),
    createdAt: new Date(),
    updatedAt: new Date(),
});

// 分析队伍属性克制关系
const analyzeTeamEffectiveness = (team: Team): TeamAnalysis => {
    const teamTypes = new Set<string>();
    const pokemonInTeam = team.pokemon.filter(
        (p) => p !== null
    ) as TeamPokemon[];

    // 收集队伍中所有宝可梦的属性
    pokemonInTeam.forEach((teamPokemon) => {
        teamPokemon.pokemon.types.forEach((typeInfo) => {
            teamTypes.add(typeInfo.type.name);
        });
    });

    const weaknesses: TypeEffectiveness[] = [];
    const resistances: TypeEffectiveness[] = [];
    const immunities: string[] = [];
    const coverage: string[] = [];

    // 分析防御能力
    Object.keys(TYPE_CHART).forEach((attackingType) => {
        let totalEffectiveness = 0;
        let pokemonCount = 0;

        pokemonInTeam.forEach((teamPokemon) => {
            const pokemonTypes = teamPokemon.pokemon.types.map(
                (t) => t.type.name
            );
            let effectiveness = 1;

            pokemonTypes.forEach((defenseType) => {
                const typeChart = TYPE_CHART[attackingType];
                if (typeChart && typeChart[defenseType] !== undefined) {
                    effectiveness *= typeChart[defenseType];
                }
            });

            totalEffectiveness += effectiveness;
            pokemonCount++;
        });

        if (pokemonCount > 0) {
            const averageEffectiveness = totalEffectiveness / pokemonCount;

            if (averageEffectiveness === 0) {
                immunities.push(attackingType);
            } else if (averageEffectiveness < 1) {
                resistances.push({
                    type: attackingType,
                    effectiveness: averageEffectiveness,
                });
            } else if (averageEffectiveness > 1) {
                weaknesses.push({
                    type: attackingType,
                    effectiveness: averageEffectiveness,
                });
            }
        }
    });

    // 分析攻击覆盖面
    teamTypes.forEach((teamType) => {
        Object.keys(TYPE_CHART[teamType] || {}).forEach((targetType) => {
            const effectiveness = TYPE_CHART[teamType][targetType];
            if (effectiveness > 1 && !coverage.includes(targetType)) {
                coverage.push(targetType);
            }
        });
    });

    // 生成改进建议
    const suggestions: string[] = [];

    if (weaknesses.length > 3) {
        suggestions.push("队伍存在较多弱点，考虑添加能够抵抗这些属性的宝可梦");
    }

    if (coverage.length < 10) {
        suggestions.push("攻击覆盖面不够广泛，考虑添加不同属性的攻击技能");
    }

    if (pokemonInTeam.length < 6) {
        suggestions.push("队伍未满员，建议补充更多宝可梦");
    }

    return {
        weaknesses: weaknesses.sort(
            (a, b) => b.effectiveness - a.effectiveness
        ),
        resistances: resistances.sort(
            (a, b) => a.effectiveness - b.effectiveness
        ),
        immunities,
        coverage,
        suggestions,
    };
};

export const useTeamStore = create<TeamState>()(
    persist(
        (set, get) => ({
            currentTeam: createDefaultTeam(),
            savedTeams: [],
            teamAnalysis: null,

            addPokemonToTeam: (pokemon: Pokemon, position: number) => {
                if (position < 0 || position > 5) return;

                set((state) => {
                    const newTeam = { ...state.currentTeam };
                    newTeam.pokemon[position] = {
                        id: Date.now(),
                        pokemon,
                        level: 50,
                        position,
                    };
                    newTeam.updatedAt = new Date();

                    return {
                        currentTeam: newTeam,
                        teamAnalysis: null, // 重置分析结果
                    };
                });

                // 自动分析队伍
                setTimeout(() => get().analyzeTeam(), 100);
            },

            removePokemonFromTeam: (position: number) => {
                if (position < 0 || position > 5) return;

                set((state) => {
                    const newTeam = { ...state.currentTeam };
                    newTeam.pokemon[position] = null;
                    newTeam.updatedAt = new Date();

                    return {
                        currentTeam: newTeam,
                        teamAnalysis: null,
                    };
                });

                setTimeout(() => get().analyzeTeam(), 100);
            },

            movePokemon: (fromPosition: number, toPosition: number) => {
                if (fromPosition === toPosition) return;
                if (
                    fromPosition < 0 ||
                    fromPosition > 5 ||
                    toPosition < 0 ||
                    toPosition > 5
                )
                    return;

                set((state) => {
                    const newTeam = { ...state.currentTeam };
                    const pokemon = newTeam.pokemon[fromPosition];

                    if (pokemon) {
                        // 交换位置
                        newTeam.pokemon[fromPosition] =
                            newTeam.pokemon[toPosition];
                        newTeam.pokemon[toPosition] = pokemon;

                        // 更新位置信息
                        if (newTeam.pokemon[fromPosition]) {
                            newTeam.pokemon[fromPosition]!.position =
                                fromPosition;
                        }
                        if (newTeam.pokemon[toPosition]) {
                            newTeam.pokemon[toPosition]!.position = toPosition;
                        }

                        newTeam.updatedAt = new Date();
                    }

                    return { currentTeam: newTeam };
                });
            },

            updatePokemonNickname: (position: number, nickname: string) => {
                set((state) => {
                    const newTeam = { ...state.currentTeam };
                    if (newTeam.pokemon[position]) {
                        newTeam.pokemon[position]!.nickname = nickname;
                        newTeam.updatedAt = new Date();
                    }
                    return { currentTeam: newTeam };
                });
            },

            updatePokemonLevel: (position: number, level: number) => {
                set((state) => {
                    const newTeam = { ...state.currentTeam };
                    if (newTeam.pokemon[position]) {
                        newTeam.pokemon[position]!.level = Math.max(
                            1,
                            Math.min(100, level)
                        );
                        newTeam.updatedAt = new Date();
                    }
                    return { currentTeam: newTeam };
                });
            },

            saveCurrentTeam: (name: string, description?: string) => {
                if (!name.trim()) return false;

                set((state) => {
                    const teamToSave = {
                        ...state.currentTeam,
                        name: name.trim(),
                        description,
                        updatedAt: new Date(),
                    };

                    const existingIndex = state.savedTeams.findIndex(
                        (t) => t.id === teamToSave.id
                    );
                    let newSavedTeams;

                    if (existingIndex >= 0) {
                        newSavedTeams = [...state.savedTeams];
                        newSavedTeams[existingIndex] = teamToSave;
                    } else {
                        newSavedTeams = [...state.savedTeams, teamToSave];
                    }

                    return {
                        currentTeam: teamToSave,
                        savedTeams: newSavedTeams,
                    };
                });
                return true;
            },

            shareTeam: (teamId?: string) => {
                const team = teamId
                    ? get().savedTeams.find((t) => t.id === teamId)
                    : get().currentTeam;

                if (!team) return null;

                const shareData = {
                    name: team.name,
                    pokemon: team.pokemon
                        .filter((p) => p !== null)
                        .map((p) => ({
                            id: p!.pokemon.id,
                            name: p!.pokemon.name,
                            level: p!.level,
                            nickname: p!.nickname,
                        })),
                    createdAt: team.createdAt,
                };

                const shareUrl = `${
                    window.location.origin
                }/team-builder?import=${encodeURIComponent(
                    JSON.stringify(shareData)
                )}`;
                return shareUrl;
            },

            importTeam: (shareData: any) => {
                try {
                    const newTeam: Team = {
                        id: `team_${Date.now()}`,
                        name: shareData.name || "导入的队伍",
                        pokemon: Array(6).fill(null),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    set({ currentTeam: newTeam });
                    return true;
                } catch (error) {
                    console.error("导入队伍失败:", error);
                    return false;
                }
            },

            isPokemonInTeam: (pokemonId: number) => {
                const currentTeam = get().currentTeam;
                return currentTeam.pokemon.some(
                    (p) => p !== null && p.pokemon.id === pokemonId
                );
            },

            loadTeam: (teamId: string) => {
                const team = get().savedTeams.find((t) => t.id === teamId);
                if (team) {
                    set({ currentTeam: { ...team } });
                    get().analyzeTeam();
                }
            },

            deleteTeam: (teamId: string) => {
                set((state) => ({
                    savedTeams: state.savedTeams.filter((t) => t.id !== teamId),
                }));
            },

            createNewTeam: (name = "新队伍") => {
                const newTeam = createDefaultTeam();
                newTeam.name = name;
                set({
                    currentTeam: newTeam,
                    teamAnalysis: null,
                });
            },

            analyzeTeam: () => {
                const currentTeam = get().currentTeam;
                const analysis = analyzeTeamEffectiveness(currentTeam);
                set({ teamAnalysis: analysis });
            },

            resetTeam: () => {
                set({
                    currentTeam: createDefaultTeam(),
                    teamAnalysis: null,
                });
            },
        }),
        {
            name: "pokemon-team-storage",
            partialize: (state) => ({
                savedTeams: state.savedTeams,
                currentTeam: state.currentTeam,
            }),
        }
    )
);
