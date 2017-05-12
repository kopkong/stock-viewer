/**
 * Created by colin on 2017/1/4.
 */
export class StockRecommend {
  code: string;
  max_PE: number;
  min_PE: number;
  avg_PE: number;
  last_PE: number;
  first_date: number;
  last_date: number;
  first_price: number;
  last_price: number;   // 除权收盘价
  last_close: number;   // 收盘价
  last_pe_ratio: number;
  years: number;
  expand_ratio: number;
  name: string;
  industry: string;

  getChineseName(prop) {
    const cn_Names = {
      code: '代码',
      max_PE: '最大PE',
      min_PE: '最小PE',
      avg_PE: '平均PE',
      last_PE: '最近PE',
      first_date: '首个交易日',
      last_date: '最近交易日',
      first_price: '首日收盘价',
      last_price: '最近除权价',   // 除权收盘价
      last_close: '最近收盘价',   // 收盘价
      last_pe_ratio: '低价指数',
      years: '上市年数',
      expand_ratio: '增长率'

    };

    return cn_Names[prop];
  }
}
