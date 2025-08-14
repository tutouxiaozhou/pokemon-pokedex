/**
 * 宝可梦API服务
 * 使用官方PokéAPI获取数据
 */

const BASE_URL = "https://pokeapi.co/api/v2";
const REQUEST_TIMEOUT = 10000; // 10秒超时

// 宝可梦中英文名称映射
const POKEMON_NAME_MAP: Record<string, string> = {
    妙蛙种子: "bulbasaur",
    妙蛙草: "ivysaur",
    妙蛙花: "venusaur",
    小火龙: "charmander",
    火恐龙: "charmeleon",
    喷火龙: "charizard",
    杰尼龟: "squirtle",
    卡咪龟: "wartortle",
    水箭龟: "blastoise",
    绿毛虫: "caterpie",
    铁甲蛹: "metapod",
    巴大蝶: "butterfree",
    独角虫: "weedle",
    铁壳蛹: "kakuna",
    大针蜂: "beedrill",
    波波: "pidgey",
    比比鸟: "pidgeotto",
    大比鸟: "pidgeot",
    小拉达: "rattata",
    拉达: "raticate",
    烈雀: "spearow",
    大嘴雀: "fearow",
    阿柏蛇: "ekans",
    阿柏怪: "arbok",
    皮卡丘: "pikachu",
    雷丘: "raichu",
    穿山鼠: "sandshrew",
    穿山王: "sandslash",
    尼多兰: "nidoran-f",
    尼多娜: "nidorina",
    尼多后: "nidoqueen",
    尼多朗: "nidoran-m",
    尼多力诺: "nidorino",
    尼多王: "nidoking",
    皮皮: "clefairy",
    皮可西: "clefable",
    六尾: "vulpix",
    九尾: "ninetales",
    胖丁: "jigglypuff",
    胖可丁: "wigglytuff",
    超音蝠: "zubat",
    大嘴蝠: "golbat",
    走路草: "oddish",
    臭臭花: "gloom",
    霸王花: "vileplume",
    派拉斯: "paras",
    派拉斯特: "parasect",
    毛球: "venonat",
    摩鲁蛾: "venomoth",
    地鼠: "diglett",
    三地鼠: "dugtrio",
    喵喵: "meowth",
    猫老大: "persian",
    可达鸭: "psyduck",
    哥达鸭: "golduck",
    猴怪: "mankey",
    火爆猴: "primeape",
    卡蒂狗: "growlithe",
    风速狗: "arcanine",
    蚊香蝌蚪: "poliwag",
    蚊香君: "poliwhirl",
    蚊香泳士: "poliwrath",
    凯西: "abra",
    勇基拉: "kadabra",
    胡地: "alakazam",
    腕力: "machop",
    豪力: "machoke",
    怪力: "machamp",
    喇叭芽: "bellsprout",
    口呆花: "weepinbell",
    大食花: "victreebel",
    玛瑙水母: "tentacool",
    毒刺水母: "tentacruel",
    小拳石: "geodude",
    隆隆石: "graveler",
    隆隆岩: "golem",
    小火马: "ponyta",
    烈焰马: "rapidash",
    呆呆兽: "slowpoke",
    呆壳兽: "slowbro",
    小磁怪: "magnemite",
    三合一磁怪: "magneton",
    大葱鸭: "farfetchd",
    嘟嘟: "doduo",
    嘟嘟利: "dodrio",
    小海狮: "seel",
    白海狮: "dewgong",
    臭泥: "grimer",
    臭臭泥: "muk",
    大舌贝: "shellder",
    刺甲贝: "cloyster",
    鬼斯: "gastly",
    鬼斯通: "haunter",
    耿鬼: "gengar",
    大岩蛇: "onix",
    催眠貘: "drowzee",
    引梦貘人: "hypno",
    大钳蟹: "krabby",
    巨钳蟹: "kingler",
    霹雳电球: "voltorb",
    顽皮雷弹: "electrode",
    蛋蛋: "exeggcute",
    椰蛋树: "exeggutor",
    卡拉卡拉: "cubone",
    嘎啦嘎啦: "marowak",
    飞腿郎: "hitmonlee",
    快拳郎: "hitmonchan",
    大舌头: "lickitung",
    瓦斯弹: "koffing",
    双弹瓦斯: "weezing",
    独角犀牛: "rhyhorn",
    钻角犀兽: "rhydon",
    吉利蛋: "chansey",
    蔓藤怪: "tangela",
    袋兽: "kangaskhan",
    墨海马: "horsea",
    海刺龙: "seadra",
    角金鱼: "goldeen",
    金鱼王: "seaking",
    海星星: "staryu",
    宝石海星: "starmie",
    魔墙人偶: "mr-mime",
    飞天螳螂: "scyther",
    迷唇姐: "jynx",
    电击兽: "electabuzz",
    鸭嘴火兽: "magmar",
    凯罗斯: "pinsir",
    肯泰罗: "tauros",
    鲤鱼王: "magikarp",
    暴鲤龙: "gyarados",
    拉普拉斯: "lapras",
    百变怪: "ditto",
    伊布: "eevee",
    水伊布: "vaporeon",
    雷伊布: "jolteon",
    火伊布: "flareon",
    多边兽: "porygon",
    菊石兽: "omanyte",
    多刺菊石兽: "omastar",
    化石盔: "kabuto",
    镰刀盔: "kabutops",
    化石翼龙: "aerodactyl",
    卡比兽: "snorlax",
    急冻鸟: "articuno",
    闪电鸟: "zapdos",
    火焰鸟: "moltres",
    迷你龙: "dratini",
    哈克龙: "dragonair",
    快龙: "dragonite",
    超梦: "mewtwo",
    梦幻: "mew",
    菊草叶: "chikorita",
    月桂叶: "bayleef",
    大菊花: "meganium",
    火球鼠: "cyndaquil",
    火岩鼠: "quilava",
    火暴兽: "typhlosion",
    小锯鳄: "totodile",
    蓝鳄: "croconaw",
    大力鳄: "feraligatr",
    // 第二世代宝可梦
    咕咕: "hoothoot",
    猫头夜鹰: "noctowl",
    芭瓢虫: "ledyba",
    安瓢虫: "ledian",
    圆丝蛛: "spinarak",
    阿利多斯: "ariados",
    叉字蝠: "crobat",
    灯笼鱼: "chinchou",
    电灯怪: "lanturn",
    皮丘: "pichu",
    皮宝宝: "cleffa",
    宝宝丁: "igglybuff",
    波克比: "togepi",
    波克基古: "togetic",
    天然雀: "natu",
    天然鸟: "xatu",
    咩利羊: "mareep",
    茸茸羊: "flaaffy",
    电龙: "ampharos",
    美丽花: "bellossom",
    玛力露: "marill",
    玛力露丽: "azumarill",
    树才怪: "sudowoodo",
    蚊香蛙皇: "politoed",
    毽子草: "hoppip",
    毽子花: "skiploom",
    毽子棉: "jumpluff",
    长尾怪手: "aipom",
    向日种子: "sunkern",
    向日花怪: "sunflora",
    蜻蜻蜓: "yanma",
    乌波: "wooper",
    沼王: "quagsire",
    太阳伊布: "espeon",
    月亮伊布: "umbreon",
    黑暗鸦: "murkrow",
    呆呆王: "slowking",
    迷唇娃: "smoochum",
    电击怪: "elekid",
    鸭嘴宝宝: "magby",
    大奶罐: "miltank",
    幸福蛋: "blissey",
    雷公: "raikou",
    炎帝: "entei",
    水君: "suicune",
    幼基拉斯: "larvitar",
    沙基拉斯: "pupitar",
    班基拉斯: "tyranitar",
    洛奇亚: "lugia",
    凤王: "ho-oh",
    时拉比: "celebi",
    // 第三世代宝可梦
    木守宫: "treecko",
    森林蜥蜴: "grovyle",
    蜥蜴王: "sceptile",
    火稚鸡: "torchic",
    力壮鸡: "combusken",
    火焰鸡: "blaziken",
    水跃鱼: "mudkip",
    沼跃鱼: "marshtomp",
    巨沼怪: "swampert",
    土狼犬: "poochyena",
    大狼犬: "mightyena",
    蛇纹熊: "zigzagoon",
    直冲熊: "linoone",
    刺尾虫: "wurmple",
    甲壳茧: "silcoon",
    狩猎凤蝶: "beautifly",
    盾甲茧: "cascoon",
    毒粉蛾: "dustox",
    莲叶童子: "lotad",
    莲帽小童: "lombre",
    乐天河童: "ludicolo",
    橡实果: "seedot",
    长鼻叶: "nuzleaf",
    狡猾天狗: "shiftry",
    傲骨燕: "taillow",
    大王燕: "swellow",
    长翅鸥: "wingull",
    大嘴鸥: "pelipper",
    拉鲁拉丝: "ralts",
    奇鲁莉安: "kirlia",
    沙奈朵: "gardevoir",
    土居忍士: "nincada",
    铁面忍者: "ninjask",
    脱壳忍者: "shedinja",
    懒人獭: "slakoth",
    过动猿: "vigoroth",
    请假王: "slaking",
    盔甲鸟: "skarmory",
    戴鲁比: "houndour",
    黑鲁加: "houndoom",
    小小象: "phanpy",
    顿甲: "donphan",
    多边兽2: "porygon2",
    惊角鹿: "stantler",
    图图犬: "smeargle",
    无畏小子: "tyrogue",
    战舞郎: "hitmontop",
};

// 属性类型中英文映射
const TYPE_NAME_MAP: Record<string, string> = {
    一般: "normal",
    火: "fire",
    水: "water",
    电: "electric",
    草: "grass",
    冰: "ice",
    格斗: "fighting",
    毒: "poison",
    地面: "ground",
    飞行: "flying",
    超能力: "psychic",
    虫: "bug",
    岩石: "rock",
    幽灵: "ghost",
    龙: "dragon",
    恶: "dark",
    钢: "steel",
    妖精: "fairy",
};

// 宝可梦基础信息接口
export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    sprites: {
        front_default: string;
        front_shiny?: string;
        back_default?: string;
        back_shiny?: string;
        other?: {
            "official-artwork"?: {
                front_default?: string;
            };
        };
    };
    types: Array<{
        slot: number;
        type: {
            name: string;
            url: string;
        };
    }>;
    stats: Array<{
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        };
    }>;
    abilities: Array<{
        ability: {
            name: string;
            url: string;
        };
        is_hidden: boolean;
        slot: number;
    }>;
    moves?: Array<{
        move: {
            name: string;
            url: string;
        };
        version_group_details?: Array<{
            level_learned_at: number;
            move_learn_method: {
                name: string;
                url: string;
            };
            version_group: {
                name: string;
                url: string;
            };
        }>;
    }>;
}

// 属性类型信息接口
export interface PokemonType {
    id: number;
    name: string;
    pokemon: Array<{
        pokemon: {
            name: string;
            url: string;
        };
        slot: number;
    }>;
}

// 通用请求函数
async function fetchWithTimeout(
    url: string,
    timeout = REQUEST_TIMEOUT
): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(
                `HTTP错误: ${response.status} ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
            if (error.name === "AbortError") {
                throw new Error("请求超时，请检查网络连接");
            }
            throw new Error(`网络请求失败: ${error.message}`);
        }

        throw new Error("未知网络错误");
    }
}

// 宝可梦API服务类
export class PokemonApiService {
    /**
     * 根据ID获取宝可梦信息
     */
    async getPokemonById(id: number): Promise<Pokemon> {
        const url = `${BASE_URL}/pokemon/${id}`;
        return await fetchWithTimeout(url);
    }

    /**
     * 根据名称获取宝可梦信息
     */
    async getPokemonByName(name: string): Promise<Pokemon> {
        const url = `${BASE_URL}/pokemon/${name.toLowerCase()}`;
        return await fetchWithTimeout(url);
    }

    /**
     * 获取宝可梦列表（分页）
     */
    async getPokemonList(
        limit = 20,
        offset = 0
    ): Promise<{
        count: number;
        next: string | null;
        previous: string | null;
        results: Array<{ name: string; url: string }>;
    }> {
        const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
        return await fetchWithTimeout(url);
    }

    /**
     * 根据属性类型获取宝可梦列表
     */
    async getPokemonByType(typeName: string): Promise<PokemonType> {
        const url = `${BASE_URL}/type/${typeName.toLowerCase()}`;
        return await fetchWithTimeout(url);
    }

    /**
     * 搜索宝可梦（支持中文和英文名称）
     */
    async searchPokemon(query: string, limit = 50): Promise<Pokemon[]> {
        try {
            if (!query.trim()) return [];

            const searchQuery = query.trim().toLowerCase();
            const results: Pokemon[] = [];

            // 1. 首先检查是否为数字ID搜索
            if (/^\d+$/.test(searchQuery)) {
                try {
                    const pokemonById = await this.getPokemonById(
                        parseInt(searchQuery)
                    );
                    return [pokemonById];
                } catch {
                    // ID搜索失败，继续其他搜索方式
                }
            }

            // 2. 检查中文名称映射
            const chineseToEnglish = POKEMON_NAME_MAP[query.trim()];
            if (chineseToEnglish) {
                try {
                    const exactMatch = await this.getPokemonByName(
                        chineseToEnglish
                    );
                    results.push(exactMatch);
                } catch {
                    // 精确匹配失败
                }
            }

            // 3. 尝试英文精确匹配
            try {
                const exactMatch = await this.getPokemonByName(searchQuery);
                // 避免重复添加
                if (!results.some((p) => p.id === exactMatch.id)) {
                    results.push(exactMatch);
                }
            } catch {
                // 精确匹配失败，继续模糊搜索
            }

            // 4. 如果精确匹配成功，直接返回
            if (results.length > 0) {
                return results;
            }

            // 5. 进行模糊搜索
            const pokemonList = await this.getPokemonList(1000, 0);

            // 英文名称模糊匹配
            const englishMatches = pokemonList.results
                .filter((pokemon) =>
                    pokemon.name.toLowerCase().includes(searchQuery)
                )
                .slice(0, limit);

            // 中文名称模糊匹配
            const chineseMatches: string[] = [];
            for (const [chineseName, englishName] of Object.entries(
                POKEMON_NAME_MAP
            )) {
                if (
                    chineseName.includes(query.trim()) &&
                    chineseMatches.length < limit
                ) {
                    chineseMatches.push(englishName);
                }
            }

            // 合并匹配结果，去重
            const allMatches = new Set([
                ...englishMatches.map((p) => p.name),
                ...chineseMatches,
            ]);

            const matchedNames = Array.from(allMatches).slice(0, limit);

            // 并发获取匹配的宝可梦详细信息
            const pokemonPromises = matchedNames.map((name) =>
                this.getPokemonByName(name).catch((error) => {
                    console.warn(`获取宝可梦 ${name} 失败:`, error);
                    return null;
                })
            );

            const pokemonResults = await Promise.all(pokemonPromises);
            return pokemonResults.filter(
                (pokemon): pokemon is Pokemon => pokemon !== null
            );
        } catch (error) {
            console.error("搜索宝可梦失败:", error);
            return [];
        }
    }

    /**
     * 获取随机宝可梦
     */
    async getRandomPokemon(count = 6): Promise<Pokemon[]> {
        const randomIds = Array.from(
            { length: count },
            () => Math.floor(Math.random() * 1010) + 1
        );

        const pokemonPromises = randomIds.map((id) =>
            this.getPokemonById(id).catch((error) => {
                console.warn(`获取宝可梦 ${id} 失败:`, error);
                return null;
            })
        );

        const results = await Promise.all(pokemonPromises);
        return results.filter(
            (pokemon): pokemon is Pokemon => pokemon !== null
        );
    }

    /**
     * 批量获取宝可梦信息
     */
    async getBatchPokemon(ids: number[]): Promise<Pokemon[]> {
        const pokemonPromises = ids.map((id) =>
            this.getPokemonById(id).catch((error) => {
                console.warn(`获取宝可梦 ${id} 失败:`, error);
                return null;
            })
        );

        const results = await Promise.all(pokemonPromises);
        return results.filter(
            (pokemon): pokemon is Pokemon => pokemon !== null
        );
    }

    /**
     * 获取所有属性类型
     */
    async getAllTypes(): Promise<Array<{ name: string; url: string }>> {
        const url = `${BASE_URL}/type`;
        const response = await fetchWithTimeout(url);
        return response.results;
    }
}

// 导出单例实例
export const pokemonApi = new PokemonApiService();

// 获取宝可梦中文名称的辅助函数
export function getPokemonChineseName(englishName: string): string {
    // 创建反向映射：英文名 -> 中文名
    const englishToChineseMap: Record<string, string> = {};
    for (const [chineseName, englishName] of Object.entries(POKEMON_NAME_MAP)) {
        englishToChineseMap[englishName] = chineseName;
    }

    return englishToChineseMap[englishName.toLowerCase()] || englishName;
}

// 错误处理辅助函数
export function handlePokemonApiError(error: any): string {
    if (error instanceof Error) {
        if (error.message.includes("超时")) {
            return "请求超时，请检查网络连接后重试";
        }
        if (error.message.includes("HTTP错误: 404")) {
            return "未找到指定的宝可梦，请检查名称或ID";
        }
        if (error.message.includes("网络请求失败")) {
            return "网络连接失败，请检查网络设置";
        }
        return error.message;
    }
    return "发生未知错误，请稍后重试";
}
