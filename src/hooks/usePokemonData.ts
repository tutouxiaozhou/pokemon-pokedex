/**
 * 宝可梦数据管理 Hooks
 * 使用原生React状态管理，不依赖React Query
 */

import { useState, useEffect, useCallback } from "react";
import {
    pokemonApi,
    Pokemon,
    handlePokemonApiError,
    getPokemonChineseName,
} from "@/services/pokemonApi";

// 通用API状态接口
interface ApiState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

// 搜索宝可梦Hook
export function useSearchPokemon(query: string, limit = 50) {
    const [state, setState] = useState<ApiState<Pokemon[]>>({
        data: null,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        if (!query.trim()) {
            setState({ data: null, isLoading: false, error: null });
            return;
        }

        let isCancelled = false;

        const searchPokemon = async () => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                // 防抖延迟
                await new Promise((resolve) => setTimeout(resolve, 300));

                if (isCancelled) return;

                const results = await pokemonApi.searchPokemon(query, limit);

                if (!isCancelled) {
                    setState({ data: results, isLoading: false, error: null });
                }
            } catch (error) {
                if (!isCancelled) {
                    setState({
                        data: null,
                        isLoading: false,
                        error:
                            error instanceof Error
                                ? error
                                : new Error("搜索失败"),
                    });
                }
            }
        };

        searchPokemon();

        return () => {
            isCancelled = true;
        };
    }, [query, limit]);

    return state;
}

// 按属性类型获取宝可梦Hook
export function usePokemonByType(typeName: string) {
    const [state, setState] = useState<ApiState<Pokemon[]>>({
        data: null,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        if (!typeName.trim()) {
            setState({ data: null, isLoading: false, error: null });
            return;
        }

        let isCancelled = false;

        const fetchPokemonByType = async () => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                const typeData = await pokemonApi.getPokemonByType(typeName);

                if (isCancelled) return;

                // 获取前20个宝可梦的详细信息
                const pokemonUrls = typeData.pokemon.slice(0, 20);
                const pokemonIds = pokemonUrls.map((p) => {
                    const urlParts = p.pokemon.url.split("/");
                    return parseInt(urlParts[urlParts.length - 2]);
                });

                const pokemonDetails = await pokemonApi.getBatchPokemon(
                    pokemonIds
                );

                if (!isCancelled) {
                    setState({
                        data: pokemonDetails,
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (error) {
                if (!isCancelled) {
                    setState({
                        data: null,
                        isLoading: false,
                        error:
                            error instanceof Error
                                ? error
                                : new Error("获取属性宝可梦失败"),
                    });
                }
            }
        };

        fetchPokemonByType();

        return () => {
            isCancelled = true;
        };
    }, [typeName]);

    return state;
}

// 获取随机宝可梦Hook
export function useRandomPokemon(count = 12, enabled = true) {
    const [state, setState] = useState<ApiState<Pokemon[]>>({
        data: null,
        isLoading: false,
        error: null,
    });

    const fetchRandomPokemon = useCallback(async () => {
        if (!enabled) return;

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const randomPokemon = await pokemonApi.getRandomPokemon(count);
            setState({ data: randomPokemon, isLoading: false, error: null });
        } catch (error) {
            setState({
                data: null,
                isLoading: false,
                error:
                    error instanceof Error
                        ? error
                        : new Error("获取随机宝可梦失败"),
            });
        }
    }, [count, enabled]);

    useEffect(() => {
        fetchRandomPokemon();
    }, [fetchRandomPokemon]);

    return {
        ...state,
        refetch: fetchRandomPokemon,
    };
}

// 获取单个宝可梦详情Hook
export function usePokemonDetail(id: number | string | null) {
    const [state, setState] = useState<ApiState<Pokemon>>({
        data: null,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        if (!id) {
            setState({ data: null, isLoading: false, error: null });
            return;
        }

        let isCancelled = false;

        const fetchPokemonDetail = async () => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                let pokemon: Pokemon;

                if (typeof id === "string" && isNaN(Number(id))) {
                    pokemon = await pokemonApi.getPokemonByName(id);
                } else {
                    pokemon = await pokemonApi.getPokemonById(Number(id));
                }

                if (!isCancelled) {
                    setState({ data: pokemon, isLoading: false, error: null });
                }
            } catch (error) {
                if (!isCancelled) {
                    setState({
                        data: null,
                        isLoading: false,
                        error:
                            error instanceof Error
                                ? error
                                : new Error("获取宝可梦详情失败"),
                    });
                }
            }
        };

        fetchPokemonDetail();

        return () => {
            isCancelled = true;
        };
    }, [id]);

    return state;
}

// 宝可梦收藏管理Hook
export function usePokemonFavorites() {
    const [favorites, setFavorites] = useState<Set<number>>(() => {
        try {
            const saved = localStorage.getItem("pokemon-favorites");
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch {
            return new Set();
        }
    });

    // 保存到localStorage
    useEffect(() => {
        try {
            localStorage.setItem(
                "pokemon-favorites",
                JSON.stringify([...favorites])
            );
        } catch (error) {
            console.warn("保存收藏失败:", error);
        }
    }, [favorites]);

    const toggleFavorite = {
        mutate: (pokemonId: number) => {
            setFavorites((prev) => {
                const newFavorites = new Set(prev);
                if (newFavorites.has(pokemonId)) {
                    newFavorites.delete(pokemonId);
                } else {
                    newFavorites.add(pokemonId);
                }
                return newFavorites;
            });
        },
    };

    const isFavorite = (pokemonId: number) => favorites.has(pokemonId);

    const getFavoritesList = useCallback(async () => {
        if (favorites.size === 0) return [];

        try {
            const favoriteIds = [...favorites];
            return await pokemonApi.getBatchPokemon(favoriteIds);
        } catch (error) {
            console.error("获取收藏列表失败:", error);
            return [];
        }
    }, [favorites]);

    return {
        favorites: [...favorites],
        toggleFavorite,
        isFavorite,
        getFavoritesList,
        favoritesCount: favorites.size,
    };
}

// 宝可梦属性类型Hook
export function usePokemonTypes() {
    const [state, setState] = useState<
        ApiState<Array<{ name: string; url: string }>>
    >({
        data: null,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        let isCancelled = false;

        const fetchTypes = async () => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                const types = await pokemonApi.getAllTypes();

                if (!isCancelled) {
                    setState({ data: types, isLoading: false, error: null });
                }
            } catch (error) {
                if (!isCancelled) {
                    setState({
                        data: null,
                        isLoading: false,
                        error:
                            error instanceof Error
                                ? error
                                : new Error("获取属性类型失败"),
                    });
                }
            }
        };

        fetchTypes();

        return () => {
            isCancelled = true;
        };
    }, []);

    return state;
}

// 导出错误处理函数和工具函数
export { handlePokemonApiError, getPokemonChineseName };
