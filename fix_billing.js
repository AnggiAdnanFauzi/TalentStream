const fs = require('fs');
const file = 'components/SubscriptionPage.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 =       }
    } catch (err) {
      if (addToast) addToast(isId ? 'Gagal memperbarui status langganan' : 'Failed to update subscription', 'error');
    } finally {
      setIsSimulatingPay(false);
    }
  };

  return (
    <div className=\"space-y-12 pb-20\">;

const repl1 =       }
    } catch (err) {
      if (addToast) addToast(isId ? 'Gagal memperbarui status langganan' : 'Failed to update subscription', 'error');
    } finally {
      setIsSimulatingPay(false);
    }
  };

  const planRanks: Record<string, number> = { free: 0, pro: 1, enterprise: 2 };
  const currentRank = planRanks[currentPlan] ?? 0;

  return (
    <div className=\"space-y-12 pb-20\">;

const target2 =           isCurrent={currentPlan === 'free'}
          currentLabel={isId ? 'Paket Saat Ini' : 'Current Plan'}
          upgradeLabel={isId ? 'Pilih Paket' : 'Select Plan'}
          onAction={() => onUpgrade('free')};

const repl2 =           isCurrent={currentPlan === 'free'}
          currentLabel={isId ? 'Paket Saat Ini' : 'Current Plan'}
          upgradeLabel={isId ? (currentRank > 0 ? 'Turunkan Paket' : 'Pilih Paket') : (currentRank > 0 ? 'Downgrade' : 'Select Plan')}
          onAction={() => onUpgrade('free')};

const target3 =           isCurrent={currentPlan === 'pro'}
          highlighted
          currentLabel={isId ? 'Paket Saat Ini' : 'Current Plan'}
          upgradeLabel={isId ? 'Tingkatkan Sekarang' : 'Upgrade Now'}
          isLoading={isProcessingPlan === 'pro'}
          onAction={() => handleCheckoutMidtrans('pro')};

const repl3 =           isCurrent={currentPlan === 'pro'}
          highlighted
          currentLabel={isId ? 'Paket Saat Ini' : 'Current Plan'}
          upgradeLabel={isId ? (currentRank > 1 ? 'Turunkan Paket' : 'Tingkatkan Sekarang') : (currentRank > 1 ? 'Downgrade' : 'Upgrade Now')}
          isLoading={isProcessingPlan === 'pro'}
          onAction={() => {
            if (currentRank > 1) {
              onUpgrade('pro');
            } else {
              handleCheckoutMidtrans('pro');
            }
          }};

content = content.replace(target1, repl1).replace(target2, repl2).replace(target3, repl3);
fs.writeFileSync(file, content);
console.log('Done!');
