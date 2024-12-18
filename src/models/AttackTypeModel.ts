// the attack types collection - how many attacks happened in each attack type - question 1

import { Document, model, Schema } from "mongoose"

export interface IAttackType extends Document {
    attacktype1_txt: string,
    countKill: number,
    countWound: number
}

const AttackTypeSchema = new Schema<IAttackType>({
    attacktype1_txt: {type: String, required: true},
    countKill: {type: Number, required: true, default: 0},
    countWound: {type: Number, required: true, default: 0}
})

export default model<IAttackType>("AttackType", AttackTypeSchema);