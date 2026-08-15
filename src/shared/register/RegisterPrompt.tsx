import * as React from 'react';
import { SPHttpClient } from '@microsoft/sp-http';
import styles from './RegisterPrompt.module.scss';
import {
  claimRegisterPromptHost,
  DEFAULT_BEST_DESCRIBE_LIST_TITLE,
  DEFAULT_BUSU_LIST_TITLE,
  DEFAULT_MARKETS_LIST_TITLE,
  DEFAULT_USER_LIST_TITLE,
  releaseRegisterPromptHost,
  shouldSkipRegisterPrompt
} from './registerConstants';
import { resolveRegisterIdentity } from './registerIdentity';
import {
  getActiveLookups,
  getUserByEmail,
  isProfileComplete,
  resolveSafeRedirect,
  saveUserProfile,
  type ILookupOption,
  type IUserProfile
} from './registerService';

export interface IRegisterPromptHostProps {
  enabled: boolean;
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  userEmail?: string;
  userDisplayName?: string;
  allowEmailQueryOverride?: boolean;
  userListTitle?: string;
  busuListTitle?: string;
  marketsListTitle?: string;
  bestDescribeListTitle?: string;
  isEditMode?: boolean;
  pageKey?: string;
}

interface IFormErrors {
  bestDescribe?: boolean;
  market?: boolean;
  busu?: boolean;
}

const RegisterPromptBody: React.FC<IRegisterPromptHostProps> = (props) => {
  const webAbsoluteUrl = props.webAbsoluteUrl;
  const client = props.spHttpClient;
  const userListTitle = props.userListTitle || DEFAULT_USER_LIST_TITLE;
  const busuListTitle = props.busuListTitle || DEFAULT_BUSU_LIST_TITLE;
  const marketsListTitle = props.marketsListTitle || DEFAULT_MARKETS_LIST_TITLE;
  const bestDescribeListTitle = props.bestDescribeListTitle || DEFAULT_BEST_DESCRIBE_LIST_TITLE;
  const identity = React.useMemo(
    () =>
      resolveRegisterIdentity(
        props.userEmail,
        props.userDisplayName,
        !!props.allowEmailQueryOverride
      ),
    [props.userEmail, props.userDisplayName, props.allowEmailQueryOverride]
  );

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [existing, setExisting] = React.useState<IUserProfile | undefined>(undefined);
  const [markets, setMarkets] = React.useState<ILookupOption[]>([]);
  const [busus, setBusus] = React.useState<ILookupOption[]>([]);
  const [bestDescribes, setBestDescribes] = React.useState<ILookupOption[]>([]);
  const [bestDescribeId, setBestDescribeId] = React.useState<number | undefined>(undefined);
  const [marketId, setMarketId] = React.useState<number | undefined>(undefined);
  const [busuId, setBusuId] = React.useState<number | undefined>(undefined);
  const [errors, setErrors] = React.useState<IFormErrors>({});
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!identity) {
      setLoading(false);
      setOpen(false);
      return;
    }

    let cancelled = false;

    Promise.all([
      getUserByEmail(client, webAbsoluteUrl, userListTitle, identity.email),
      getActiveLookups(client, webAbsoluteUrl, marketsListTitle, false),
      getActiveLookups(client, webAbsoluteUrl, busuListTitle, false),
      getActiveLookups(client, webAbsoluteUrl, bestDescribeListTitle, true)
    ])
      .then((results) => {
        if (cancelled) {
          return;
        }
        const user = results[0];
        const nextMarkets = results[1];
        const nextBusus = results[2];
        const nextBest = results[3];
        if (!nextMarkets.length || !nextBusus.length || !nextBest.length) {
          setOpen(false);
          setLoading(false);
          return;
        }
        setExisting(user);
        setMarkets(nextMarkets);
        setBusus(nextBusus);
        setBestDescribes(nextBest);
        if (user) {
          setMarketId(user.marketId);
          setBusuId(user.busuId);
          setBestDescribeId(user.bestDescribeId);
        }
        setOpen(!isProfileComplete(user));
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setOpen(false);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    client,
    webAbsoluteUrl,
    userListTitle,
    marketsListTitle,
    busuListTitle,
    bestDescribeListTitle,
    identity
  ]);

  React.useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!identity || saving) {
      return;
    }

    const nextErrors: IFormErrors = {
      bestDescribe: !bestDescribeId,
      market: !marketId,
      busu: !busuId
    };
    setErrors(nextErrors);
    setSaveError(undefined);

    if (nextErrors.bestDescribe || nextErrors.market || nextErrors.busu) {
      return;
    }

    setSaving(true);
    try {
      await saveUserProfile(client, webAbsoluteUrl, userListTitle, identity, existing, {
        marketId: marketId as number,
        busuId: busuId as number,
        bestDescribeId: bestDescribeId as number
      });
      const selected = bestDescribes.filter((item) => item.id === bestDescribeId)[0];
      const next = resolveSafeRedirect(selected ? selected.redirectUrl : undefined, webAbsoluteUrl);
      if (next) {
        window.location.href = next;
        return;
      }
      setOpen(false);
    } catch {
      setSaveError('Could not save your details. Please try again.');
      setSaving(false);
    }
  };

  if (!identity || (!loading && !open)) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ae-register-title"
        aria-busy={loading || saving}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        {loading ? (
          <p className={styles.loading}>Loading registration…</p>
        ) : (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.contentWrap}>
              <div className={styles.left} aria-hidden="true">
                <div className={styles.bgImage} />
              </div>
              <div className={styles.right}>
                <h2 id="ae-register-title" className={styles.title}>
                  Which one describes you best?
                </h2>
                <fieldset className={styles.radioGroup}>
                  <legend className={styles.legend}>Which one describes you best?</legend>
                  {bestDescribes.map((item) => {
                    const inputId = 'ae-register-best-' + item.id;
                    return (
                      <div className={styles.radioRow} key={item.id}>
                        <input
                          className={styles.radioInput}
                          type="radio"
                          id={inputId}
                          name="ae-best-describe"
                          value={item.id}
                          checked={bestDescribeId === item.id}
                          onChange={() => setBestDescribeId(item.id)}
                        />
                        <label className={styles.radioLabel} htmlFor={inputId}>
                          {item.title}
                        </label>
                      </div>
                    );
                  })}
                </fieldset>
                {errors.bestDescribe && (
                  <span className={styles.error}>This field is required!</span>
                )}
              </div>
            </div>

            <div className={styles.dropdowns}>
              <div className={styles.field}>
                <div className={`${styles.selectWrap} ${styles.selectWrapMarket}`}>
                  <select
                    className={styles.select}
                    id="ae-register-market"
                    aria-label="Market"
                    aria-required="true"
                    value={marketId ? String(marketId) : ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setMarketId(v ? parseInt(v, 10) : undefined);
                    }}
                  >
                    <option value="" disabled>
                      Select Market
                    </option>
                    {markets.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.market && <span className={styles.error}>This field is required!</span>}
              </div>
              <div className={styles.field}>
                <div className={`${styles.selectWrap} ${styles.selectWrapBusu}`}>
                  <select
                    className={styles.select}
                    id="ae-register-busu"
                    aria-label="BUSU"
                    aria-required="true"
                    value={busuId ? String(busuId) : ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setBusuId(v ? parseInt(v, 10) : undefined);
                    }}
                  >
                    <option value="" disabled>
                      Select BUSU
                    </option>
                    {busus.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.busu && <span className={styles.error}>This field is required!</span>}
              </div>
            </div>

            <div className={styles.submitWrap}>
              <button className={styles.submitBtn} type="submit" disabled={saving}>
                {saving ? 'Submitting…' : 'Submit'}
              </button>
            </div>
            {saveError && <p className={styles.saveError}>{saveError}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

const RegisterPromptHost: React.FC<IRegisterPromptHostProps> = (props) => {
  const skip = shouldSkipRegisterPrompt(props.isEditMode);
  const [claimed] = React.useState(() => {
    if (!props.enabled || skip) {
      return false;
    }
    return claimRegisterPromptHost();
  });

  React.useEffect(() => {
    return () => {
      if (claimed) {
        releaseRegisterPromptHost();
      }
    };
  }, [claimed]);

  if (!props.enabled || skip || !claimed) {
    return null;
  }

  return <RegisterPromptBody {...props} key={props.pageKey || 'register'} />;
};

export default RegisterPromptHost;
