// 订阅套餐配置（暂时不接入支付，用微信收款）
export const PLANS = [
  {
    id: 'monthly',
    name: '月度会员',
    description: '1个月订阅',
    price: 49,
    duration: 1, // 月
  },
  {
    id: 'quarterly',
    name: '季度会员',
    description: '3个月订阅',
    price: 129,
    duration: 3,
    popular: true,
  },
  {
    id: 'biannual',
    name: '半年会员',
    description: '6个月订阅',
    price: 239,
    duration: 6,
  },
]
