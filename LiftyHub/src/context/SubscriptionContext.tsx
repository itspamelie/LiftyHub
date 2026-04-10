import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSubscriptions } from "@/src/services/api";

export type PlanLevel = 0 | 1 | 2; // 0=Free, 1=Basic, 2=Pro

interface Plan {
  id: number;
  name: string;
  level: PlanLevel;
  price: number;
  description: string;
}

interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: "active" | "expired" | "cancelled";
  plan: Plan;
}

interface SubscriptionContextType {
  plan: Plan | null;
  planLevel: PlanLevel;
  loading: boolean;
  refresh: () => Promise<void>;
}

const FREE_PLAN: Plan = {
  id: 1,
  name: "Free",
  level: 0,
  price: 0,
  description: "Acceso limitado",
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  plan: FREE_PLAN,
  planLevel: 0,
  loading: true,
  refresh: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    try {
      // Dev override: permite cambiar plan sin tocar el backend
      const devOverride = await AsyncStorage.getItem("@liftyhub_dev_plan");
      if (devOverride) {
        setPlan(JSON.parse(devOverride));
        setLoading(false);
        return;
      }

      const token = await AsyncStorage.getItem("token");
      const userRaw = await AsyncStorage.getItem("user");
      if (!token || !userRaw) {
        setPlan(FREE_PLAN);
        return;
      }

      const user = JSON.parse(userRaw);
      const res = await getSubscriptions(token);

      if (res?.data) {
        // Buscar suscripción activa del usuario
        const userSub: Subscription | undefined = res.data.find(
          (s: Subscription) => s.user_id === user.id && s.status === "active"
        );

        if (userSub?.plan) {
          setPlan({
            id: userSub.plan.id,
            name: userSub.plan.name,
            level: userSub.plan.level as PlanLevel,
            price: userSub.plan.price,
            description: userSub.plan.description,
          });
        } else {
          setPlan(FREE_PLAN);
        }
      } else {
        setPlan(FREE_PLAN);
      }
    } catch {
      setPlan(FREE_PLAN);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        plan: plan ?? FREE_PLAN,
        planLevel: (plan?.level ?? 0) as PlanLevel,
        loading,
        refresh: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
